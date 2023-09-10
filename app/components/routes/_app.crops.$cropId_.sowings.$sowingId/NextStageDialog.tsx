import {
  useDismiss,
  useFloating,
  useClick,
  useRole,
  useInteractions,
  FloatingOverlay,
  FloatingFocusManager,
} from "@floating-ui/react";
import { useActionData, useNavigation } from "@remix-run/react";
import classNames from "classnames";
import { useEffect, useState } from "react";

import type { Stage } from "~/models/crop";
import type { action } from "~/routes/_app.crops.$cropId_.sowings.$sowingId";

export type NextStageDialogProps = {
  nextStage: Stage;
};

export const NextStageDialog = ({ nextStage }: NextStageDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
  });
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (navigation.state === "idle" && actionData?.successful) {
      setIsOpen(false);
    }
  }, [actionData?.successful, navigation.state]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        type="button"
        className={classNames(
          "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          {
            "bg-green-600 focus-visible:outline-green-600 hover:bg-green-500":
              nextStage === "growing",
            "bg-orange-500 focus-visible:outline-orange-500 hover:bg-orange-400":
              nextStage === "storing",
          }
        )}
      >
        {formStageImperative(nextStage)}
      </button>
      {isOpen && (
        <FloatingOverlay
          lockScroll
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
        >
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              className="mt-24 bg-white p-4 dark:bg-gray-800 sm:ml-72 sm:mr-8"
            >
              <div className="flex flex-row justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button
                  name="intent"
                  value="progress"
                  type="submit"
                  className={classNames(
                    "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    {
                      "bg-green-600 focus-visible:outline-green-600 hover:bg-green-500":
                        nextStage === "growing",
                      "bg-orange-500 focus-visible:outline-orange-500 hover:bg-orange-400":
                        nextStage === "storing",
                    }
                  )}
                >
                  {formStageImperative(nextStage)}
                </button>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
};

const formStageImperative = (stage: Stage) => {
  switch (stage) {
    case "planning":
      return "Plan";
    case "growing":
      return "Plant";
    case "storing":
      return "Harvest";
  }
};
