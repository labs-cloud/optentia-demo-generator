import type { Task } from "@/types/demo";
import { Badge, SectionShell, statusStyles } from "@/components/ui";

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  return (
    <SectionShell title="Task & Asana Board" eyebrow="Work created by Operator">
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">{task.title}</h3>
              <Badge tone={task.priority === "Urgent" ? statusStyles.Escalated : task.priority === "High" ? statusStyles.Waiting : statusStyles.Completed}>{task.priority}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-2.5 py-1">Due {task.due}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">Assigned to {task.assignedTo}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">Created by {task.createdBy}</span>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
