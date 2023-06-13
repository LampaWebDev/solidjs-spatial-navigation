<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=@lampa/solidjs-spatial-navigation&background=tiles&project=%20" alt="SolidJS spatial navigation">
</p>

# @lampa/solidjs-spatial-navigation

SolidJS spatial navigation library. Forked from [NoriginMedia/Norigin-Spatial-Navigation](https://github.com/NoriginMedia/Norigin-Spatial-Navigation).

# Supported Devices

The library is theoretically intended to work on any web-based platform such as Browsers and Smart TVs.
For as long as the UI/UX is built with the SolidJS Framework, it works on the Samsung Tizen TVs, LG WebOS TVs, Hisense Vidaa TVs and a range of other Connected TVs.
This library is actively used and continuously tested on many devices and updated periodically in the table below:

| Platform                   | Name                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Web Browsers               | Chrome, Firefox, etc.                                                                                                |
| Smart TVs                  | [Samsung Tizen](https://developer.tizen.org/?langswitch=en), [LG WebOS](https://webostv.developer.lge.com/), Hisense |
| Other Connected TV devices | Browser Based settop boxes with Chromium, Ekioh or Webkit browsers                                                   |

# Changelog

A list of changes for all the versions for the solidjs-spatial-navigation:
[CHANGELOG.md](https://github.com/LampaWebDev/solidjs-spatial-navigation/blob/master/CHANGELOG.md)

# Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Technical details and concepts](#technical-details-and-concepts)

# Installation

```bash
npm i @lampa/solidjs-spatial-navigation --save
```

# Usage

## Initialization

[Init options](#init-options)

```jsx
// Called once somewhere in the root of the app

import { init } from '@lampa/solidjs-spatial-navigation';

init({
	// options
});
```

## Making your component focusable

Most commonly you will have Leaf Focusable components. (See [Tree Hierarchy](#tree-hierarchy-of-focusable-components))
Leaf component is the one that doesn't have focusable children.

```jsx
import { Focusable } from '@lampa/solidjs-spatial-navigation';

function Button() {
	return (
		<Focusable as="div">
			{({ focused }) => <div className={focused() ? 'button-focused' : 'button'}>Press me</div>}
		</Focusable>
	);
}
```

## Wrapping Leaf components with a FocusableGroup

FocusableGroup is the one that has other focusable children. (i.e. a scrollable list) (See [Tree Hierarchy](#tree-hierarchy-of-focusable-components))
`FocusableGroup` is required in order to provide all children components with the `focusKey` of the Container,
which serves as a Parent Focus Key for them. This way your focusable children components can be deep in the DOM tree
while still being able to know who is their Focusable Parent.
FocusableGroup cannot have `focused` state, but instead propagates focus down to appropriate Child component.
You can nest multiple FocusableGroups. When focusing the top level Container, it will propagate focus down until it encounters the first Leaf component.
I.e. if you set focus to the `Page`, the focus could propagate as following: `Page` -> `ContentWrapper` -> `ContentList` -> `ListItem`.

```jsx
import { FocusableGroup } from '@lampa/solidjs-spatial-navigation';
import ListItem from './ListItem';

function ContentList() {
	return (
		<FocusableGroup as="div" focusKey="parent">
			{() => (
				<>
					<ListItem />
					<ListItem />
					<ListItem />
				</>
			)}
		</FocusableGroup>
	);
}
```

## Get API for managing focus

```jsx
import { useSpatialNavigation } from '@lampa/solidjs-spatial-navigation';
import { onMount } from 'solid-js';

function App() {
	const { setFocus } = useSpatialNavigation();

	onMount(() => {
		setFocus('some-focus-key');
	});

	return (
		<Focusable as="div" focusKey="some-focus-key">
			{({ focused }) => <div class={focused() ? 'class' : 'class_focused'}>Press me</div>}
		</Focusable>
	);
}
```

## Tracking children components

Any FocusableGroup can track whether it has any Child focused or not. This feature is disabled by default,
but it can be controlled by the `trackChildren` prop passed to the `FocusableGroup` hook. When enabled, the hook will return
a `hasFocusedChild` flag indicating when a Container component is having focused Child down in the focusable Tree.
It is useful for example when you want to style a container differently based on whether it has focused Child or not.

```jsx
import { FocusableGroup } from '@lampa/solidjs-spatial-navigation';
import MenuItem from './MenuItem';

function ContentList() {
	return (
		<FocusableGroup as="div" focusKey="parent" trackChildren={true}>
			{({ hasFocusedChild }) => (
				<div className={hasFocusedChild() ? 'menu-expanded' : 'menu-collapsed'}>
					<MenuItem />
					<MenuItem />
					<MenuItem />
				</div>
			)}
		</FocusableGroup>
	);
}
```

## Restricting focus to a certain component boundaries

Sometimes you don't want the focus to leave your component, for example when displaying a Popup, you don't want the focus to go to
a component underneath the Popup. This can be enabled with `isFocusBoundary` props passed to the `FocusableGroup` component.

```jsx
import { onMount } from 'solid-js';
import { FocusableGroup, useSpatialNavigation } from '@lampa/solidjs-spatial-navigation';

function Popup() {
	const { setFocus } = useSpatialNavigation();

	onMount(() => {
		setFocus('parent-1');
	});

	return (
		<FocusableGroup as="div" focusKey="parent-1" isFocusBoundary={true}>
			{() => {
				<div>
					<ButtonPrimary />
					<ButtonSecondary />
				</div>;
			}}
		</FocusableGroup>
	);
}
```

# API

## Top Level exports

### `init`

#### Init options

##### `debug`: boolean (default: false)

Enables console debugging.

##### `visualDebug`: boolean (default: false)

Enables visual debugging (all layouts, reference points and siblings reference points are printed on canvases).

##### `throttle`: integer (default: 0)

Enables throttling of the key event listener.

##### `throttleKeypresses`: boolean (default: false)

Works only in combination with `throttle` > 0. By default, `throttle` only throttles key down events (i.e. when you press and hold the button).
When this feature is enabled, it will also throttle rapidly fired key presses (rapid "key down + key up" events).

##### `useGetBoundingClientRect`: boolean (default: false)

This flag enables using `getBoundingClientRect` for measuring element sizes and positions. Default behavior is using DOM `offset` values.
The difference is that `getBoundingClientRect` will measure coordinates and sizes post CSS transforms, while `offset` measurement will measure them pre CSS transforms.
For example if you have an element with `translateX(50)`, the X position with the default measurement will still be 0, while `getBoundingClientRect` measurement will result in X being 50.
The choice depends on how often you are using transforms, and whether you want it to result into coordinates shift or not.
Sometimes you would want element to be _visually_ translated, but its coordinates to be calculated as it was before the translation.

##### `shouldFocusDOMNode`: boolean (default: false)

This flag makes the underlying _accessible_ DOM node to become focused as well. This is useful for [_accessible_](https://developer.mozilla.org/en-US/docs/Web/Accessibility) web applications.
Note that it is the developer's responsibility to make the elements accessible! There are [many resources](https://www.google.com/search?q=web+accessibility) online on the subject. [HTML Semantics and Accessibility Cheat Sheet](https://webaim.org/resources/htmlcheatsheet/) is perhaps a good start,
as it dives directly into the various html tags and how it complies with accessibility. Non-accessible tags like `<div>` needs to have the [tabindex](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets) attribute set.
Also consider `role` and `aria-label` attributes. But that depends on the application.

### `setKeyMap`

Method to set custom key codes. I.e. when the device key codes differ from a standard browser arrow key codes.

```jsx
setKeyMap({
	left: 9001,
	up: 9002,
	right: 9003,
	down: 9004,
	enter: 9005,
});
```

There is also support for mapping multiple key codes to a single direction. This can be useful when working with gamepads that utilize a joystick and a directional pad and you want to make use of both.

```jsx
setKeyMap({
	left: [205, 214],
	up: [203, 211],
	right: [206, 213],
	down: [204, 212],
	enter: [195],
});
```

### `setThrottle`

A method for dynamically updating `throttle` and `throttleKeypresses` values. This might be useful if you want to throttle listeners under specific sections or pages.

```jsx
setThrottle({
	throttle: 500,
	throttleKeypresses: true,
});
```

### `destroy`

Resets all the settings and the storage of focusable components. Disables the navigation service.

### `Focusable` and `FocusableGroup` components

```jsx
<Focusable {...focusableProps} {...otherProps}>
	{children}
</Focusable>
```

#### Props

##### `as`: ValidComponent (default: "div")

##### `focusable` (default: true)

This prop indicates that the component can be focused via directional navigation.
Even if the component is not `focusable`, it still can be focused with the manual `setFocus`.
This prop is useful when i.e. you have a Disabled Button that should not be focusable in the disabled state.

##### `saveLastFocusedChild` (default: true)

By default, when the focus leaves a `FocusableGroup`, the last focused child of that container is saved.
So the next time when you go back to that Group, the last focused child will get the focus.
If this feature is disabled, the focus will be always on the first available child of the Group.

##### `trackChildren` (default: false)

This prop controls the feature of updating the `hasFocusedChild` prop received to the children callback function.
Since you don't always need `hasFocusedChild` value, this feature is disabled by default for optimization purposes.

##### `autoRestoreFocus` (default: true)

By default, when the currently focused component is unmounted (deleted), navigation service will try to restore the focus
on the nearest available sibling of that component. If this behavior is undesirable, you can disable it by setting this
flag to `false`.

##### `isFocusBoundary` (default: false)

This prop makes the FocusableGroup keep the focus inside its boundaries. It will only block the focus from leaving
the Container via directional navigation. You can still set the focus manually anywhere via `setFocus`.
Useful when i.e. you have a modal Popup and you don't want the focus to leave it.

##### `focusKey` (optional)

If you want your component to have a persistent focus key, it can be set via this property. Otherwise, it will be auto generated.
Useful when you want to manually set the focus to this component via `setFocus`.

##### `preferredChildFocusKey` (optional)

Useful when you have a FocusableGroup and you want it to propagate the focus to a **specific** child component.
I.e. when you have a Popup and you want some specific button to be focused instead of the first available.

##### `onEnterPress` (function)

Callback that is called when the component is focused and Enter key is pressed.
Receives `extraProps` (see below) and `KeyPressDetails` as arguments.

##### `onEnterRelease` (function)

Callback that is called when the component is focused and Enter key is released.
Receives `extraProps` (see below) as argument.

##### `onArrowPress` (function)

Callback that is called when component is focused and any Arrow key is pressed.
Receives `direction` (`left`, `right`, `up`, `down`), `extraProps` (see below) and `KeyPressDetails` as arguments.
This callback HAS to return `true` if you want to proceed with the default directional navigation behavior, or `false`
if you want to block the navigation in the specified direction.

##### `onFocus` (function)

Callback that is called when component gets focus.
Receives `FocusableComponentLayout`, `extraProps` and `FocusDetails` as arguments.

##### `onBlur` (function)

Callback that is called when component loses focus.
Receives `FocusableComponentLayout`, `extraProps` and `FocusDetails` as arguments.

##### `extraProps` (optional)

An object that can be passed to the hook in order to be passed back to certain callbacks (see above).
I.e. you can pass all the `props` of the component here, and get them all back in those callbacks.

#### Focusable children callback `(args:FocusableCallbackProps)=>JSX.Element`

#### FocusableCallbackProps

##### `focusSelf` (function)

Method to set the focus on the current component. I.e. to set the focus to the Page (Container) when it is mounted, or
the Popup component when it is displayed.

##### `setFocus` (function) `(focusKey: string) => void`

Method to manually set the focus to a component providing its `focusKey`.

##### `focused` (boolean)

Flag that indicates that the current component is focused.

##### `hasFocusedChild` (boolean)

Flag that indicates that the current component has a focused child somewhere down the Focusable Tree.
Only works when `trackChildren` is enabled!

##### `focusKey` (string)

String that contains the focus key for the component. It is either the same as `focusKey` passed to the hook params,
or an automatically generated one.

#### `getCurrentFocusKey` (function) `() => string`

Returns the currently focused component's focus key.

##### `navigateByDirection` (function) `(direction: string, focusDetails: FocusDetails) => void`

Method to manually navigation to a certain direction. I.e. you can assign a mouse-wheel to navigate Up and Down.
Also useful when you have some "Arrow-like" UI in the app that is meant to navigate in certain direction when pressed
with the mouse or a "magic remote" on some TVs.

##### `pause` (function)

Pauses all the key event handlers.

##### `resume` (function)

Resumes all the key event handlers.

##### `updateAllLayouts` (function)

Manually recalculate all the layouts. Rarely used.

### `useSpatialNavigation` hook

```jsx
const {
	/* hook output */
} = useSpatialNavigation();
```

#### Hook output

##### `setFocus` (function) `(focusKey: string) => void`

Method to manually set the focus to a component providing its `focusKey`.

#### `getCurrentFocusKey` (function) `() => string`

Returns the currently focused component's focus key.

##### `navigateByDirection` (function) `(direction: string, focusDetails: FocusDetails) => void`

Method to manually navigation to a certain direction. I.e. you can assign a mouse-wheel to navigate Up and Down.
Also useful when you have some "Arrow-like" UI in the app that is meant to navigate in certain direction when pressed
with the mouse or a "magic remote" on some TVs.

##### `pause` (function)

Pauses all the key event handlers.

##### `resume` (function)

Resumes all the key event handlers.

##### `updateAllLayouts` (function)

Manually recalculate all the layouts. Rarely used.

## Types exported for development

### `FocusableComponentLayout`

```ts
interface FocusableComponentLayout {
	left: number; // absolute coordinate on the screen
	top: number; // absolute coordinate on the screen
	width: number;
	height: number;
	x: number; // relative to the parent DOM element
	y: number; // relative to the parent DOM element
	node: HTMLElement;
}
```

### `KeyPressDetails`

```ts
interface KeyPressDetails {
	pressedKeys: PressedKeys;
}
```

### `PressedKeys`

```ts
type PressedKeys = { [index: string]: number };
```

### `FocusDetails`

```ts
interface FocusDetails {
	event?: KeyboardEvent;
}
```

## Other Types exported

These types are exported, but not necessarily needed for development.

### `KeyMap`

Interface for the `keyMap` sent to the `setKeyMap` method.

### `FocusableProps`

Interface for the `Focusable` and `FocusableGroup` props.

### `FocusableCallbackProps`

Interface for the `Focusable` and `FocusableGroup` children callback function arguments.

# Technical details and concepts

## Tree Hierarchy of focusable components

As mentioned in the [Usage](#usage) section, all focusable components are organized in a Tree structure. Much like a DOM
tree, the Focusable Tree represents a focusable components' organization in your application. Tree Structure helps to
organize all the focusable areas in the application, measure them and determine the best paths of navigation between
these focusable areas. Without the Tree Structure (assuming all components would be simple Leaf focusable components) it
would be extremely hard to measure relative and absolute coordinates of the elements inside the scrolling lists, as well
as to restrict the focus from jumping outside certain areas. Technically the Focusable Tree structure is achieved by
passing a focus key of the parent component down via the `FocusableGroup`. Since React Context can be nested, you can have
multiple layers of focusable Containers, each passing their own `focusKey` down the Tree via `FocusableGroup` as
shown in [this example](#wrapping-leaf-components-with-a-focusable-container).

## Navigation Service

[Navigation Service](https://github.com/LampaWebDev/solidjs-spatial-navigation/blob/master/src/SpatialNavigation.ts) is a
"brain" of the library. It is responsible for registering each focusable component in its internal database, storing
the node references to measure their coordinates and sizes, and listening to the key press events in order to perform
the navigation between these components. The calculation is performed according to the proprietary algorithm, which
measures the coordinate of the current component and all components in the direction of the navigation, and determines the
best path to pass the focus to the next component.

# Development

```bash
npm i
npm start
```

# License

**MIT Licensed**
