# &lt;UnstyledTextareaAutosize /&gt;

![npm version](https://badgen.net/npm/v/unstyled-textarea-autosize?icon=npm&label)
![GitHub checks](https://badgen.net/github/checks/teamrevin/unstyled-textarea-autosize/publish?icon=github&label=GitHub)

`<UnstyledTextareaAutosize />` is an unstyled multi-line text component for React that adapts to its content.

## Installation

Use your favourite manager to install the [package](https://www.npmjs.com/package/unstyled-textarea-autosize):

```sh
yarn add unstyled-textarea-autosize
```

```sh
npm install unstyled-textarea-autosize --save
```

## Example

```ts
import React from "react";
import { UnstyledTextareaAutosize } from "unstyled-textarea-autosize";

export function Example({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <UnstyledTextareaAutosize
            className="example"
            value={value}
            onValueChange={onChange}
        />
    );
}
```

## Properties

The component accepts all properties of the intrinsic `div` component, including the `style` and `className` properties. In addition, it accepts the following properties:

-   `readOnly?: boolean`: Content cannot be edited if set to `true`.
-   `value?: string`: The current content value of the text component (controlled mode).
-   `initialValue?: string`: The initial content value of the text component (uncontrolled mode).
-   `onValueChange?: (value: string) => void`: A callback function that is called each time the user edits the content.

## Attributes

A reference to the component provides all attributes of the intrinsic `div` DOM element. In addition, it provides the following attribute:

-   `value: string`: The current content value of the text component.

Please use the exported type `UnstyledTextareaAutosizeElement` for the reference.

## License

This library is licensed under the MIT license.

## Contributing

We welcome contributions to the `unstyled-textarea-autosize` library. To contribute, simply open a [pull request](https://github.com/teamrevin/unstyled-textarea-autosize/pulls) with your changes.
