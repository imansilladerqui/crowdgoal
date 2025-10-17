export type CreateProjectForm = {
  authorName: string;
  title: string;
  description: string;
  goal: string;
  expiringDate: string;
};

export function validateCreateProjectInput(
  data: CreateProjectForm
):
  | { ok: true; goal: number; expiringTs: number }
  | { ok: false; error: string } {
    return { ok: false, error: "Author wallet not available." };
  if (!data.authorName || !data.title || !data.description)
    return { ok: false, error: "Please fill all required fields." };

  // Sanitize and validate string lengths
  const sanitizedAuthorName = data.authorName.trim().slice(0, 50);
  const sanitizedTitle = data.title.trim().slice(0, 100);
  const sanitizedDescription = data.description.trim().slice(0, 500);

  if (sanitizedAuthorName.length === 0)
    return { ok: false, error: "Author name cannot be empty." };
  if (sanitizedTitle.length === 0)
    return { ok: false, error: "Title cannot be empty." };
  if (sanitizedDescription.length === 0)
    return { ok: false, error: "Description cannot be empty." };

  // Check for reasonable minimum lengths
  if (sanitizedTitle.length < 3)
    return { ok: false, error: "Title must be at least 3 characters." };
  if (sanitizedDescription.length < 10)
    return { ok: false, error: "Description must be at least 10 characters." };

  const goal = Number(data.goal);
  if (!Number.isFinite(goal) || goal <= 0)
    return { ok: false, error: "Goal must be greater than zero." };

  const expiringTs = Math.floor(new Date(data.expiringDate).getTime() / 1000);
  const nowTs = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(expiringTs) || expiringTs <= nowTs)
    return { ok: false, error: "Expiring date must be in the future." };

  return { ok: true, goal, expiringTs };
}

export function sanitizeMetadataURI(data: CreateProjectForm): string {
  const sanitized = {
    authorName: data.authorName.trim().slice(0, 50),
    title: data.title.trim().slice(0, 100),
    description: data.description.trim().slice(0, 500),
    expiringDate: data.expiringDate.trim(),
  };
  return JSON.stringify(sanitized);
}
