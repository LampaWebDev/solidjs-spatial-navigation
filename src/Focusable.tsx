import {
	JSX,
	createEffect,
	createMemo,
	createSignal,
	mergeProps,
	onCleanup,
	onMount,
	splitProps,
} from 'solid-js';

import { Dynamic } from 'solid-js/web';
import { FocusableCallbackProps, FocusableProps } from './useSpatialNavigation';
import { noop, uniqueId } from 'lodash';
import {
	FocusDetails,
	FocusableComponentLayout,
	KeyPressDetails,
	SpatialNavigation,
} from './SpatialNavigation';
import { useFocusContext } from './useFocusedContext';

interface Props<P extends HTMLElement = HTMLElement>
	extends Omit<JSX.HTMLAttributes<P>, 'children' | 'ref'> {
	children: (props: FocusableCallbackProps) => JSX.Element;
}

const defaultProps: Required<FocusableProps> = {
	as: 'div',
	focusable: true,
	saveLastFocusedChild: true,
	trackChildren: false,
	autoRestoreFocus: true,
	isFocusBoundary: false,
	focusKey: undefined,
	preferredChildFocusKey: undefined,
	onEnterPress: noop,
	onEnterRelease: noop,
	onArrowPress: () => true,
	onFocus: noop,
	onBlur: noop,
	extraProps: {},
};

export const Focusable = <P extends HTMLElement = HTMLElement>(pr: FocusableProps & Props<P>) => {
	const mergedProps = mergeProps(defaultProps, pr);
	const [, rest] = splitProps(mergedProps, [
		'as',
		'children',
		'focusable',
		'saveLastFocusedChild',
		'trackChildren',
		'autoRestoreFocus',
		'isFocusBoundary',
		'focusKey',
		'preferredChildFocusKey',
		'onEnterPress',
		'onEnterRelease',
		'onArrowPress',
		'onFocus',
		'onBlur',
		'extraProps',
	]);

	const onEnterPressHandler = (details: KeyPressDetails) => {
		mergedProps.onEnterPress(mergedProps.extraProps, details);
	};

	const onEnterReleaseHandler = () => {
		mergedProps.onEnterRelease(mergedProps.extraProps);
	};

	const onArrowPressHandler = (direction: string, details: KeyPressDetails) =>
		mergedProps.onArrowPress(direction, mergedProps.extraProps, details);

	const onFocusHandler = (layout: FocusableComponentLayout, details: FocusDetails) => {
		mergedProps.onFocus(layout, mergedProps.extraProps, details);
	};

	const onBlurHandler = (layout: FocusableComponentLayout, details: FocusDetails) => {
		mergedProps.onBlur(layout, mergedProps?.extraProps, details);
	};

	let ref: HTMLElement;

	const [focused, setFocused] = createSignal(false);
	const [hasFocusedChild, setHasFocusedChild] = createSignal(false);

	const parentFocusKey = useFocusContext();

	/**
	 * Either using the propFocusKey passed in, or generating a random one
	 */
	const focusKey = createMemo(() => mergedProps.focusKey || uniqueId('sn:focusable-item-'));

	const focusSelf = (focusDetails: FocusDetails = {}) => {
		SpatialNavigation.setFocus(mergedProps.focusKey as string, focusDetails);
	};

	onMount(() => {
		SpatialNavigation.addFocusable({
			focusKey: focusKey(),
			node: ref,
			parentFocusKey,
			preferredChildFocusKey: mergedProps.preferredChildFocusKey,
			onEnterPress: onEnterPressHandler as (details?: KeyPressDetails) => void,
			onEnterRelease: onEnterReleaseHandler,
			onArrowPress: onArrowPressHandler,
			onFocus: onFocusHandler,
			onBlur: onBlurHandler,
			onUpdateFocus: (isFocused = false) => {
				setFocused(isFocused);
			},
			onUpdateHasFocusedChild: (isFocused = false) => {
				setHasFocusedChild(isFocused);
			},
			saveLastFocusedChild: mergedProps.saveLastFocusedChild,
			trackChildren: mergedProps.trackChildren,
			isFocusBoundary: mergedProps.isFocusBoundary,
			autoRestoreFocus: mergedProps.autoRestoreFocus,
			focusable: mergedProps.focusable,
		});
	});

	onCleanup(() => {
		SpatialNavigation.removeFocusable({
			focusKey: focusKey(),
		});
	});

	createEffect(() => {
		SpatialNavigation.updateFocusable(focusKey(), {
			node: ref,
			preferredChildFocusKey: mergedProps.preferredChildFocusKey,
			focusable: mergedProps.focusable as boolean,
			isFocusBoundary: mergedProps.isFocusBoundary as boolean,
			onEnterPress: onEnterPressHandler,
			onEnterRelease: onEnterReleaseHandler,
			onArrowPress: onArrowPressHandler,
			onFocus: onFocusHandler,
			onBlur: onBlurHandler,
		});
	});

	return (
		<Dynamic component={mergedProps.as} ref={ref} {...rest}>
			{mergedProps.children({
				ref,
				focusSelf,
				focused,
				hasFocusedChild,
				focusKey,
				setFocus: SpatialNavigation.setFocus,
				navigateByDirection: SpatialNavigation.navigateByDirection,
				pause: SpatialNavigation.pause,
				resume: SpatialNavigation.resume,
				updateAllLayouts: SpatialNavigation.updateAllLayouts,
				getCurrentFocusKey: SpatialNavigation.getCurrentFocusKey,
			})}
		</Dynamic>
	);
};
