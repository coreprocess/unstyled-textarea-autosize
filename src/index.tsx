import React, { ComponentProps, FormEvent, forwardRef, KeyboardEvent, useCallback, useEffect } from 'react';
import { useRefWithForwarding } from 'use-ref-with-forwarding';
import './index.css';

export type UnstyledTextareaAutosizeProps = ComponentProps<'div'> & {
    readOnly?: boolean;
    value?: string;
    initialValue?: string;
    placeholder?: string;
    onValueChange?: (value: string) => void;
};

export type UnstyledTextareaAutosizeElement = HTMLDivElement & {
    value: string;
};

const INVALID_CTRL_KEYS = ['b', 'i', 'u'];

function initElement(element: UnstyledTextareaAutosizeElement | null) {
    if (element) {
        Object.defineProperty(element, 'value', {
            get: function () {
                return element.innerText;
            },
            set: function (newValue) {
                element.innerText = newValue;
            },
        });
    }
}

function isElementInitialized(
    element: UnstyledTextareaAutosizeElement | null
): element is UnstyledTextareaAutosizeElement {
    if (!element) {
        console.error('unstyled-textarea-autosize: unexpected null ref');
        return false;
    }
    if (Object.getOwnPropertyDescriptor(element, 'value') === undefined) {
        console.error('unstyled-textarea-autosize: value property not configured');
        return false;
    }
    return true;
}

export const UnstyledTextareaAutosize = forwardRef<
    UnstyledTextareaAutosizeElement | null,
    UnstyledTextareaAutosizeProps
>(function UnstyledTextareaAutosize(
    { readOnly, value, initialValue, placeholder, className, onValueChange, onInput, onKeyDown, ...props },
    outerRef
) {
    // initialize dom element with the value property

    // reference to the root element
    const ref = useRefWithForwarding<UnstyledTextareaAutosizeElement | null>(null, [initElement, outerRef]);

    // update the text when the value changes (controlled mode)
    useEffect(() => {
        // check if reference is initialized
        if (!isElementInitialized(ref.current)) {
            return;
        }

        // don"t update if value is undefined
        if (value === undefined) {
            return;
        }

        // update the text if it has changed
        if (ref.current.value !== value) {
            ref.current.value = value;
        }
    }, [ref, value]);

    // apply the initial test when the component is mounted (uncontrolled mode)
    useEffect(() => {
        // check if reference is initialized
        if (!isElementInitialized(ref.current)) {
            return;
        }

        // don"t update if initial value is undefined
        if (initialValue === undefined) {
            return;
        }

        // update the text if it deviates from the initial value
        if (ref.current.value !== initialValue) {
            ref.current.value = initialValue;
        }

        // NOTE: do not add initialValue to the dependency list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    // propagate value changes
    const onInternalInput = useCallback(
        (event: FormEvent<UnstyledTextareaAutosizeElement>) => {
            // check if reference is initialized
            if (!isElementInitialized(ref.current)) {
                return;
            }

            // propagate the value change
            const newValue = ref.current.value;
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
        (event: KeyboardEvent<UnstyledTextareaAutosizeElement>) => {
            // check if reference is initialized
            if (!isElementInitialized(ref.current)) {
                return;
            }

            // block formatting shortcuts
            if ((event.ctrlKey || event.metaKey) && INVALID_CTRL_KEYS.includes(event.key)) {
                event.preventDefault();
            }

            // blur on escape
            if (event.key === 'Escape') {
                ref.current.blur();
                getSelection()?.removeAllRanges();
            }

            // call outer onKeyDown handler for full transparency
            if (onKeyDown) {
                onKeyDown(event);
            }
        },
        [ref, onKeyDown]
    );

    // render the div element
    return (
        <div
            {...props}
            data-placeholder={placeholder}
            className={`${className ?? ''} unstyled-textarea-autosize`}
            ref={ref}
            contentEditable={!readOnly}
            onInput={onInternalInput}
            onKeyDown={onInternalKeyDown}
        />
    );
});
