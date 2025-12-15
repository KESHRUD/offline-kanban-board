import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "../../components/TaskCard";
import type { Task } from "../../types";

// Mock the theme hook to return "pro" theme
vi.mock("../../hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "pro",
    t: (key: string) => key,
  }),
}));

// Mock audio service
vi.mock("../../services/audioService", () => ({
  audioManager: {
    play: vi.fn(),
  },
}));

describe("TaskCard Component", () => {
  const mockTask: Task = {
    id: "t-1",
    title: "Test Task",
    description: "Test description",
    columnId: "todo",
    tags: ["test", "frontend"],
    priority: "high",
    createdAt: Date.now(),
    subtasks: [],
    comments: [],
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnDragStart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders task title correctly", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("displays priority badge", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("renders tags with hashtag prefix", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    // In "pro" theme, tags are prefixed with #
    expect(screen.getByText("#test")).toBeInTheDocument();
    expect(screen.getByText("#frontend")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    // Find all buttons - first one is edit, second is delete
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    // Find all buttons - first one is edit, second is delete
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it("is draggable", () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    const card = container.querySelector('[draggable="true"]');
    expect(card).toBeInTheDocument();
  });
});
