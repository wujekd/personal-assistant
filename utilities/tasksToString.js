export function tasksToString(tasks) {
    return tasks.map(task => {
        return `Task: ${task.content}
Due: ${task.due?.date || "No due date"}
Completed: ${task.is_completed ? "Yes" : "No"}`;
    }).join("\n\n");
}