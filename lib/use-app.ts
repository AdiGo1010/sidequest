"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  estimatedTaskHours,
  INTERNATIONAL_FORTNIGHT_HOURS,
  MIN_TASK_BUDGET,
} from "./compliance";
import { getServerSnapshot, getSnapshot, setState, subscribe, uid, applyRemoteSlice } from "./store";
import { mergeMarket, sliceMarket } from "./market";
import { isAustralianUniEmail, uniFromEmail } from "./uni";
import type {
  Application,
  Category,
  EquipmentBooking,
  Profile,
  QuestSuggestion,
  Residency,
  Role,
  Task,
} from "./types";

export function useApp() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const state = mounted ? snap : getServerSnapshot();
  const me = state.profiles.find((p) => p.id === state.currentUserId) ?? null;

  useEffect(() => {
    let stop = false;
    async function pull() {
      try {
        const res = await fetch("/api/market", { cache: "no-store" });
        if (!res.ok || stop) return;
        const remote = await res.json();
        const merged = mergeMarket(remote, sliceMarket(getSnapshot()));
        applyRemoteSlice(merged);
      } catch {
        /* stay on local data */
      }
    }
    void pull();
    const timer = window.setInterval(pull, 5000);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, []);

  const signup = useCallback(
    (input: {
      email: string;
      password: string;
      fullName: string;
      role: Role;
      location: string;
      residency?: Residency;
      visaDocumentName?: string;
    }) => {
      if (input.role === "student" && !isAustralianUniEmail(input.email)) {
        throw new Error(
          "To accept student tasks you need a valid .edu.au email. Other emails can join as a client and post work.",
        );
      }
      if (input.role === "student" && input.residency === "international" && !input.visaDocumentName) {
        throw new Error("International students need to upload a copy of their visa.");
      }
      const exists = getSnapshot().profiles.some(
        (p) => p.email.toLowerCase() === input.email.toLowerCase(),
      );
      if (exists) throw new Error("An account with that email already exists");
      const profile: Profile = {
        id: uid("u"),
        email: input.email.trim().toLowerCase(),
        fullName: input.fullName.trim(),
        role: input.role,
        uni: input.role === "student" ? uniFromEmail(input.email) : undefined,
        bio: "",
        skills: [],
        licences: [],
        residency: input.role === "student" ? input.residency ?? "domestic" : undefined,
        visaDocumentName: input.visaDocumentName,
        fortnightHours: 0,
        location: input.location,
        verifiedBadge: input.role === "student" && isAustralianUniEmail(input.email),
        rating: 0,
        reviewCount: 0,
        completedTasks: 0,
        totalEarnings: 0,
        createdAt: new Date().toISOString(),
      };
      void input.password;
      setState((s) => ({
        ...s,
        profiles: [...s.profiles, profile],
        currentUserId: profile.id,
      }));
    },
    [],
  );

  const login = useCallback((email: string) => {
    const user = getSnapshot().profiles.find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user) throw new Error("No account found — try joining free");
    setState((s) => ({ ...s, currentUserId: user.id }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: null }));
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Pick<Profile, "bio" | "skills" | "licences" | "fullName" | "location">>) => {
      setState((s) => ({
        ...s,
        profiles: s.profiles.map((p) =>
          p.id === s.currentUserId ? { ...p, ...patch } : p,
        ),
      }));
    },
    [],
  );

  const postTask = useCallback(
    (input: Omit<Task, "id" | "status" | "clientId" | "createdAt" | "hiredStudentId">) => {
      if (input.budget < MIN_TASK_BUDGET) {
        throw new Error(`Tasks start at $${MIN_TASK_BUDGET}+ — adult pay, no youth wage.`);
      }
      const id = uid("t");
      setState((s) => {
        if (!s.currentUserId) throw new Error("Log in first");
        const task: Task = {
          ...input,
          id,
          status: "open",
          clientId: s.currentUserId,
          createdAt: new Date().toISOString(),
        };
        return { ...s, tasks: [task, ...s.tasks] };
      });
      return id;
    },
    [],
  );

  const applyToTask = useCallback((taskId: string, message: string) => {
    setState((s) => {
      if (!s.currentUserId) throw new Error("Log in first");
      const meUser = s.profiles.find((p) => p.id === s.currentUserId);
      if (!meUser || meUser.role !== "student" || !isAustralianUniEmail(meUser.email)) {
        throw new Error(
          "Only verified students with a .edu.au email can accept student tasks. Post work with a client account instead.",
        );
      }
      const task = s.tasks.find((t) => t.id === taskId);
      if (!task) throw new Error("Task not found");
      if (meUser.residency === "international") {
        const nextHours = (meUser.fortnightHours ?? 0) + estimatedTaskHours(task);
        if (nextHours > INTERNATIONAL_FORTNIGHT_HOURS) {
          throw new Error(
            `International students are capped at ${INTERNATIONAL_FORTNIGHT_HOURS} hours per fortnight. This job would take you to ${nextHours}h.`,
          );
        }
      }
      const already = s.applications.some(
        (a) => a.taskId === taskId && a.studentId === s.currentUserId,
      );
      if (already) throw new Error("You already applied to this task");
      const application: Application = {
        id: uid("a"),
        taskId,
        studentId: s.currentUserId,
        message,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      return { ...s, applications: [application, ...s.applications] };
    });
  }, []);

  const hireApplicant = useCallback((taskId: string, studentId: string) => {
    setState((s) => {
      const task = s.tasks.find((t) => t.id === taskId);
      const start = new Date();
      start.setHours(16, 0, 0, 0);
      const end = new Date(start.getTime() + 2 * 3600000);
      return {
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: "in_progress" as const, hiredStudentId: studentId }
            : t,
        ),
        applications: s.applications.map((a) =>
          a.taskId === taskId
            ? { ...a, status: a.studentId === studentId ? "hired" as const : "rejected" as const }
            : a,
        ),
        calendarEvents: task
          ? [
              {
                id: uid("cal"),
                title: `SideQuest · ${task.title}`,
                start: start.toISOString(),
                end: end.toISOString(),
                source: "sidequest" as const,
              },
              ...s.calendarEvents,
            ]
          : s.calendarEvents,
      };
    });
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setState((s) => {
      const task = s.tasks.find((t) => t.id === taskId);
      if (!task?.hiredStudentId) return s;
      const hours = estimatedTaskHours(task);
      return {
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, status: "completed" } : t,
        ),
        profiles: s.profiles.map((p) =>
          p.id === task.hiredStudentId
            ? {
                ...p,
                completedTasks: p.completedTasks + 1,
                totalEarnings: p.totalEarnings + task.budget,
                fortnightHours: (p.fortnightHours ?? 0) + hours,
              }
            : p,
        ),
      };
    });
  }, []);

  const leaveReview = useCallback(
    (taskId: string, toId: string, rating: number, comment: string) => {
      setState((s) => {
        if (!s.currentUserId) return s;
        const existing = s.reviews.some(
          (r) => r.taskId === taskId && r.fromId === s.currentUserId,
        );
        if (existing) return s;
        const nextReviews = [
          {
            id: uid("r"),
            taskId,
            fromId: s.currentUserId,
            toId,
            rating,
            comment,
            createdAt: new Date().toISOString(),
          },
          ...s.reviews,
        ];
        const forUser = nextReviews.filter((r) => r.toId === toId);
        const avg =
          forUser.reduce((sum, r) => sum + r.rating, 0) / Math.max(forUser.length, 1);
        return {
          ...s,
          reviews: nextReviews,
          profiles: s.profiles.map((p) =>
            p.id === toId
              ? { ...p, rating: Number(avg.toFixed(1)), reviewCount: forUser.length }
              : p,
          ),
        };
      });
    },
    [],
  );

  const bookEquipment = useCallback(
    (equipmentId: string, startDate: string, endDate: string) => {
      setState((s) => {
        if (!s.currentUserId) throw new Error("Log in first");
        const item = s.equipment.find((e) => e.id === equipmentId);
        if (!item) throw new Error("Listing not found");
        const overlap = s.bookings.some(
          (b) =>
            b.equipmentId === equipmentId &&
            b.status === "booked" &&
            !(endDate < b.startDate || startDate > b.endDate),
        );
        if (overlap || !item.available) {
          throw new Error("Those dates are not available");
        }
        const booking: EquipmentBooking = {
          id: uid("b"),
          equipmentId,
          studentId: s.currentUserId,
          startDate,
          endDate,
          status: "booked",
        };
        return {
          ...s,
          bookings: [booking, ...s.bookings],
          equipment: s.equipment.map((e) =>
            e.id === equipmentId ? { ...e, available: false } : e,
          ),
        };
      });
    },
    [],
  );

  const generateSuggestions = useCallback(() => {
    setState((s) => {
      if (!s.currentUserId) return s;
      const meUser = s.profiles.find((p) => p.id === s.currentUserId);
      if (!meUser || meUser.role !== "student") return s;
      const open = s.tasks.filter(
        (t) => t.status === "open" && t.location === meUser.location,
      );
      const windows = [
        {
          start: new Date(Date.now() + 18 * 3600000).toISOString(),
          end: new Date(Date.now() + 21 * 3600000).toISOString(),
          hint: "You have a 3-hour gap after classes today",
        },
        {
          start: new Date(Date.now() + 3 * 86400000 + 15 * 3600000).toISOString(),
          end: new Date(Date.now() + 3 * 86400000 + 18 * 3600000).toISOString(),
          hint: "Friday afternoon looks free",
        },
      ];
      const suggestions: QuestSuggestion[] = windows.map((w, i) => {
        const task = open[i % Math.max(open.length, 1)];
        const category = (task?.category ?? meUser.skills[0] ?? "Delivery") as Category;
        return {
          id: uid("sug"),
          studentId: s.currentUserId!,
          category,
          reason: `${w.hint}. ${task ? `“${task.title}” fits (${task.category}, $${task.budget}).` : `A ${category} gig nearby would slot in nicely.`}`,
          start: w.start,
          end: w.end,
          taskId: task?.id,
          confirmed: false,
        };
      });
      return { ...s, suggestions, googleConnected: true };
    });
  }, []);

  const confirmSuggestion = useCallback(
    (id: string, fallback?: { title: string; start: string; end: string }) => {
      setState((s) => {
        const sug = s.suggestions.find((x) => x.id === id);
        const task = sug ? s.tasks.find((t) => t.id === sug.taskId) : undefined;
        const title =
          fallback?.title ??
          (task ? `SideQuest · ${task.title}` : sug ? `SideQuest · ${sug.category}` : null);
        const start = fallback?.start ?? sug?.start;
        const end = fallback?.end ?? sug?.end;
        if (!title || !start || !end) return s;
        return {
          ...s,
          suggestions: sug
            ? s.suggestions.map((x) => (x.id === id ? { ...x, confirmed: true } : x))
            : s.suggestions,
          calendarEvents: [
            {
              id: uid("cal"),
              title,
              start,
              end,
              source: "sidequest",
            },
            ...s.calendarEvents,
          ],
        };
      });
    },
    [],
  );

  const rejectApplicant = useCallback((taskId: string, studentId: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.taskId === taskId && a.studentId === studentId
          ? { ...a, status: "rejected" as const }
          : a,
      ),
    }));
  }, []);

  const sendMessage = useCallback((taskId: string, body: string) => {
    const text = body.trim();
    if (!text) return;
    setState((s) => {
      if (!s.currentUserId) throw new Error("Log in first");
      const task = s.tasks.find((t) => t.id === taskId);
      if (!task) throw new Error("Task not found");
      const isClient = task.clientId === s.currentUserId;
      const isHired = task.hiredStudentId === s.currentUserId;
      const applied = s.applications.some(
        (a) => a.taskId === taskId && a.studentId === s.currentUserId,
      );
      if (!isClient && !isHired && !applied) {
        throw new Error("Apply first, then you can message");
      }
      return {
        ...s,
        messages: [
          {
            id: uid("m"),
            taskId,
            fromId: s.currentUserId,
            body: text,
            createdAt: new Date().toISOString(),
          },
          ...s.messages,
        ],
      };
    });
  }, []);

  return {
    state,
    me,
    signup,
    login,
    logout,
    updateProfile,
    postTask,
    applyToTask,
    hireApplicant,
    rejectApplicant,
    sendMessage,
    completeTask,
    leaveReview,
    bookEquipment,
    generateSuggestions,
    confirmSuggestion,
  };
}
