import React, {
    ComponentProps,
    FormEvent,
    forwardRef,
    KeyboardEvent,
    useCallback,
    useEffect,
} from "react";
import { useRefWithForwarding } from "use-ref-with-forwarding";

const VALID_CTRL_KEYS = ["c", "v", "x", "z", "r", "ArrowLeft", "ArrowRight"];

export type UnstyledTextareaAutosizeProps = ComponentProps<"div"> & {
    readOnly?: boolean;
    value?: string;
    onValueChange?: (value: string) => void;
};

export const UnstyledTextareaAutosize = forwardRef<
    HTMLDivElement | null,
    UnstyledTextareaAutosizeProps
>(function UnstyledTextareaAutosize(
    { readOnly, value, onValueChange, onInput, onKeyDown, ...props },
    outerRef
) {
    // reference to the root element
    const ref = useRefWithForwarding<HTMLDivElement | null>(
        null,
        outerRef ? [outerRef] : []
    );

    // update the div element when the value changes
    useEffect(() => {
        if (!ref.current) {
            console.error("unstyled-textarea-autosize: unexpected null ref");
            return;
        }
        if (value === undefined) {
            return;
        }
        if (ref.current.innerText !== value) {
            ref.current.innerText = value;
        }
    }, [ref, value]);

    // propagate value changes
    const onInternalInput = useCallback(
        (event: FormEvent<HTMLDivElement>) => {
            // check if reference is available
            if (!ref.current) {
                console.error(
                    "unstyled-textarea-autosize: unexpected null ref"
                );
                return;
            }

            // propagate the value change
            const newValue = ref.current.innerText;
            if (newValue !== value && onValueChange) {
                onValueChange(newValue);
            }

            // call outer onInput handler for full transparency
            if (onInput) {
                onInput(event);
            }
        },
        [ref, value, onValueChange, onInput]
    );

    // prevent formatting shortcuts
    const onInternalKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            // block formatting shortcuts
            if (
                (event.ctrlKey || event.metaKey) &&
                !VALID_CTRL_KEYS.includes(event.key)
            ) {
                event.preventDefault();
            }

            // call outer onKeyDown handler for full transparency
            if (onKeyDown) {
                onKeyDown(event);
            }
        },
        [onKeyDown]
    );

    // render the div element
    return (
        <div
            {...props}
            ref={ref}
            contentEditable={!readOnly}
            onInput={onInternalInput}
            onKeyDown={onInternalKeyDown}
        />
    );
});
