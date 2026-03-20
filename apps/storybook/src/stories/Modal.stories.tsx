import { ModalProps, Modal } from "@packages/spark-ui";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, useRef } from "react";

function ModalTrigger({
  label = "Open Modal",
  children,
  modalProps,
}: {
  label?: string;
  children?: React.ReactNode;
  modalProps?: Partial<ModalProps>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      <Modal open={open} onOpenChange={setOpen} {...modalProps}>
        {children ?? <DefaultContent onClose={() => setOpen(false)} />}
      </Modal>
    </>
  );
}

function DefaultContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Modal title</h2>
        <p className="mt-1 text-sm text-white/60">
          This is a default modal. It has a title, a description, and a couple
          of action buttons.
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={onClose}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

function LongContent() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-white">Terms of Service</h2>
      {Array.from({ length: 12 }).map((_, i) => (
        <p key={i} className="text-sm text-white/60">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      ))}
    </div>
  );
}

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A fully accessible modal dialog built on the native `<dialog>` element. Supports controlled and uncontrolled modes, focus trapping, scroll locking, close interception, and composable overlay control.",
      },
    },
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls visibility in controlled mode.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
    },
    placement: {
      control: "select",
      options: ["center", "bottom", "adaptive"],
    },
    scrollBehavior: {
      control: "select",
      options: ["inside", "outside"],
    },
    role: {
      control: "select",
      options: ["dialog", "alertdialog"],
    },
    closeOnOverlayClick: { control: "boolean" },
    closeOnEsc: { control: "boolean" },
    withOverlay: { control: "boolean" },
    overlayOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    overlayBlur: { control: "text" },
    lockScroll: { control: "boolean" },
    preserveScrollBarGap: { control: "boolean" },
    trapFocus: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => <ModalTrigger modalProps={args} />,
  args: {
    size: "xl",
    placement: "center",
    closeOnOverlayClick: true,
    closeOnEsc: true,
    withOverlay: true,
    lockScroll: true,
    scrollBehavior: "inside",
    preserveScrollBarGap: false,
    trapFocus: true,
    role: "dialog",
  },
};
export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When `open` is provided the parent owns visibility state. The modal never opens or closes on its own.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div className="flex gap-2">
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
            onClick={() => setOpen(true)}
          >
            Open
          </button>
          <button
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
            onClick={() => setOpen(false)}
          >
            Close externally
          </button>
        </div>
        <Modal open={open} onOpenChange={setOpen}>
          <DefaultContent onClose={() => setOpen(false)} />
        </Modal>
      </>
    );
  },
};

export const Uncontrolled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When `open` is omitted the modal manages its own visibility state internally. `onOpenChange` still fires so the parent can react without owning state.",
      },
    },
  },
  render: () => {
    const [lastEvent, setLastEvent] = useState<string>("—");
    return (
      <div className="flex flex-col items-center gap-4">
        <ModalTrigger
          label="Open (uncontrolled)"
          modalProps={{ onOpenChange: (v) => setLastEvent(String(v)) }}
        />
        <p className="text-sm text-white/50">
          Last <code>onOpenChange</code> value: <strong>{lastEvent}</strong>
        </p>
      </div>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: "All available size variants." },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
        <ModalTrigger
          key={size}
          label={`Size: ${size}`}
          modalProps={{ size }}
        />
      ))}
    </div>
  ),
};

export const PlacementCenter: Story = {
  name: "Placement / Center",
  parameters: {
    docs: {
      description: {
        story:
          "It is always centered regardless of the viewport size.",
      },
    },
  },
  render: () => <ModalTrigger label="Center (default)" modalProps={{ placement: "center" }} />,
};

export const PlacementBottom: Story = {
  name: "Placement / Bottom",
  parameters: {
    docs: {
      description: {
        story:
          "It is always at the bottom regardless of the viewport size",
      },
    },
  },
  render: () => <ModalTrigger label="Bottom sheet" modalProps={{ placement: "bottom" }} />,
};

export const PlacementAdaptive: Story = {
  name: "Placement / Adaptive",
  parameters: {
    docs: {
      description: {
        story:
          "On mobile viewports it is at the bottom. On desktop it is always centered.",
      },
    },
  },
  render: () => <ModalTrigger label="Center (default)" modalProps={{ placement: "adaptive" }} />,
};

export const DisableOverlayClose: Story = {
  name: "Close Behavior / Disable Overlay Click",
  parameters: {
    docs: {
      description: {
        story: "Clicking the overlay will not close the modal.",
      },
    },
  },
  render: () => (
    <ModalTrigger
      label="No overlay close"
      modalProps={{ closeOnOverlayClick: false }}
    />
  ),
};

export const DisableEscClose: Story = {
  name: "Close Behavior / Disable Esc Key",
  render: () => (
    <ModalTrigger
      label="No Esc close"
      modalProps={{ closeOnEsc: false }}
    />
  ),
};

export const BeforeCloseInterception: Story = {
  name: "Close Behavior / onBeforeClose",
  parameters: {
    docs: {
      description: {
        story:
          "`onBeforeClose` can return `false` to cancel the close — useful for unsaved-changes guards.",
      },
    },
  },
  render: () => {
    const [dirty, setDirty] = useState(false);
    const [open, setOpen] = useState(false);

    const handleBeforeClose = async () => {
      if (!dirty) return true;
      return window.confirm("You have unsaved changes. Discard them?");
    };

    return (
      <>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          onClick={() => { setDirty(false); setOpen(true); }}
        >
          Open Modal
        </button>
        <Modal open={open} onOpenChange={setOpen} onBeforeClose={handleBeforeClose}>
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Edit profile</h2>
            <input
              className="rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              placeholder="Type something to mark as dirty..."
              onChange={() => setDirty(true)}
            />
            <div className="flex flex-col">
              <p className="text-xs text-white/40">
                {dirty
                  ? "⚠️ Unsaved changes — closing will prompt confirmation."
                  : "No changes yet."}
              </p>
              <p className="text-xs text-white/40">
                  Close this modal by clicking the overlay or by pressing <kbd>Esc</kbd>
              </p>
            </div>
            <button
              className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              onClick={() => setOpen(false)}
            >
              Save & Close
            </button>
          </div>
        </Modal>
      </>
    );
  },
};

export const AsyncBeforeClose: Story = {
  name: "Close Behavior / Async onBeforeClose",
  parameters: {
    docs: {
      description: {
        story:
          "`onBeforeClose` supports async functions — useful for API calls before dismissal.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");

    const handleBeforeClose = async () => {
      setStatus("saving");
      await new Promise((res) => setTimeout(res, 1500));
      setStatus("done");
      return true;
    };

    return (
      <>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          onClick={() => { setStatus("idle"); setOpen(true); }}
        >
          Open Modal
        </button>
        <Modal open={open} onOpenChange={setOpen} onBeforeClose={handleBeforeClose}>
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Auto-save on close</h2>
            <p className="text-sm text-white/60">
              Closing this modal triggers a simulated async save (1.5s).
            </p>
            <div className="flex flex-col">
              <p className="text-xs text-white/40">Status: {status}</p>
              <p className="text-xs text-white/40">
                  Close this modal by clicking the overlay or by pressing <kbd>Esc</kbd>
              </p>
            </div>
            
            <button
              className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      </>
    );
  },
};

export const NoOverlay: Story = {
  name: "Overlay / Hidden",
  render: () => (
    <ModalTrigger label="No overlay" modalProps={{ withOverlay: false }} />
  ),
};

export const CustomOverlayOpacity: Story = {
  name: "Overlay / Custom Opacity",
  render: () => (
    <div className="flex gap-2">
      {([0.2, 0.5, 0.9] as const).map((op) => (
        <ModalTrigger
          key={op}
          label={`Opacity ${op}`}
          modalProps={{ overlayOpacity: op }}
        />
      ))}
    </div>
  ),
};

export const OverlayBlur: Story = {
  name: "Overlay / Backdrop Blur",
  render: () => (
    <ModalTrigger label="Blur overlay" modalProps={{ overlayBlur: "6px" }} />
  ),
};

export const ScrollInside: Story = {
  name: "Scroll / Inside (default)",
  parameters: {
    docs: {
      description: {
        story: "The panel scrolls internally. Body remains fixed.",
      },
    },
  },
  render: () => (
    <ModalTrigger
      label="Scroll inside"
      modalProps={{ scrollBehavior: "inside", size: "sm" }}
    >
      <LongContent />
    </ModalTrigger>
  ),
};

export const ScrollOutside: Story = {
  name: "Scroll / Outside",
  parameters: {
    docs: {
      description: {
        story: "The overlay scrolls. The panel grows to fit its content.",
      },
    },
  },
  render: () => (
    <ModalTrigger
      label="Scroll outside"
      modalProps={{ scrollBehavior: "outside", size: "sm" }}
    >
      <LongContent />
    </ModalTrigger>
  ),
};

export const PreserveScrollBarGap: Story = {
  name: "Scroll / Preserve Scrollbar Gap",
  parameters: {
    docs: {
      description: {
        story:
          "Adds `padding-right` equal to the scrollbar width on open to prevent layout shift.",
      },
    },
  },
  render: () => (
    <ModalTrigger
      label="With scrollbar gap"
      modalProps={{ lockScroll: true, preserveScrollBarGap: true }}
    />
  ),
};

export const AlertDialog: Story = {
  name: "A11y / Alert Dialog Role",
  parameters: {
    docs: {
      description: {
        story:
          "`role=\"alertdialog\"` signals to assistive technology that user action is required.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          onClick={() => setOpen(true)}
        >
          Destructive action
        </button>
        <Modal open={open} onOpenChange={setOpen} role="alertdialog" size="sm">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Delete account?</h2>
            <p className="text-sm text-white/60">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const InitialFocus: Story = {
  name: "A11y / Initial Focus Ref",
  parameters: {
    docs: {
      description: {
        story:
          "`initialFocusRef` directs focus to a specific element when the modal opens — here the cancel button receives focus instead of the first focusable element.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          onClick={() => setOpen(true)}
        >
          Open (focus → Cancel)
        </button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          initialFocusRef={cancelRef}
          size="sm"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Confirm action</h2>
            <p className="text-sm text-white/60">Cancel is focused on open.</p>
            <div className="flex justify-end gap-2">
              <button
                ref={cancelRef}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white outline-none ring-2 ring-blue-500 focus:ring-blue-400"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                onClick={() => setOpen(false)}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const FinalFocus: Story = {
  name: "A11y / Final Focus Ref",
  parameters: {
    docs: {
      description: {
        story:
          "`finalFocusRef` controls which element regains focus after the modal closes.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const targetRef = useRef<HTMLButtonElement>(null);

    return (
      <div className="flex flex-col gap-4">
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          onClick={() => setOpen(true)}
        >
          Open Modal
        </button>
        <button
          ref={targetRef}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          Focus returns here on close
        </button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          finalFocusRef={targetRef}
          size="sm"
        >
          <DefaultContent onClose={() => setOpen(false)} />
        </Modal>
      </div>
    );
  },
};

export const NoFocusTrap: Story = {
  name: "A11y / No Focus Trap",
  parameters: {
    docs: {
      description: {
        story:
          "Focus trap disabled — Tab will cycle outside the modal. Use with caution.",
      },
    },
  },
  render: () => (
    <ModalTrigger label="No focus trap" modalProps={{ trapFocus: false }} />
  ),
};

export const NestedModals: Story = {
  name: "Composition / Nested Modals",
  parameters: {
    docs: {
      description: {
        story: "Modals can be nested. Each manages its own portal and state.",
      },
    },
  },
  render: () => {
    const [outer, setOuter] = useState(false);
    const [inner, setInner] = useState(false);

    return (
      <>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          onClick={() => setOuter(true)}
        >
          Open outer modal
        </button>
        <Modal open={outer} onOpenChange={setOuter} size="lg">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Outer modal</h2>
            <p className="text-sm text-white/60">
              This modal contains a trigger for a second, nested modal.
            </p>
            <button
              className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              onClick={() => setInner(true)}
            >
              Open inner modal
            </button>
            <button
              className="self-end rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
              onClick={() => setOuter(false)}
            >
              Close outer
            </button>
          </div>
        </Modal>
        <Modal open={inner} onOpenChange={setInner} size="sm">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Inner modal</h2>
            <p className="text-sm text-white/60">A modal inside a modal.</p>
            <button
              className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              onClick={() => setInner(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      </>
    );
  },
};

export const FormModal: Story = {
  name: "Composition / Form",
  parameters: {
    docs: {
      description: {
        story:
          "A realistic form inside a modal with unsaved-changes guard via `onBeforeClose`.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const savedName = useRef("");
    const savedEmail = useRef("");

    const isDirty =
      name !== savedName.current || email !== savedEmail.current;

    const handleBeforeClose = () => {
      if (!isDirty) return true;
      return window.confirm("Discard unsaved changes?");
    };

    const handleSave = () => {
      savedName.current = name;
      savedEmail.current = email;
      setOpen(false);
    };

    return (
      <>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          onClick={() => setOpen(true)}
        >
          Edit profile
        </button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          onBeforeClose={handleBeforeClose}
          size="md"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Edit profile</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">Name</label>
              <input
                className="rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">Email</label>
              <input
                type="email"
                className="rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {isDirty && (
              <p className="text-xs text-yellow-400">Unsaved changes</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-40"
                disabled={!isDirty}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};