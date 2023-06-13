import { noop } from 'lodash';
import {
	FocusableComponentLayout,
	FocusDetails,
	KeyPressDetails,
	SpatialNavigation,
} from './SpatialNavigation';

import { Accessor, ValidComponent } from 'solid-js';

export type EnterPressHandler<P = object> = (props: P, details: KeyPressDetails) => void;

export type EnterReleaseHandler<P = object> = (props: P) => void;

export type ArrowPressHandler<P = object> = (
	direction: string,
	props: P,
	details: KeyPressDetails
) => boolean;

export type FocusHandler<P = object> = (
	layout: FocusableComponentLayout,
	props: P,
	details: FocusDetails
) => void;

export type BlurHandler<P = object> = (
	layout: FocusableComponentLayout,
	props: P,
	details: FocusDetails
) => void;

export interface FocusableProps<P = object> {
	as?: ValidComponent;
	focusable?: boolean;
	saveLastFocusedChild?: boolean;
	trackChildren?: boolean;
	autoRestoreFocus?: boolean;
	isFocusBoundary?: boolean;
	focusKey?: string;
	preferredChildFocusKey?: string;
	onEnterPress?: EnterPressHandler<P>;
	onEnterRelease?: EnterReleaseHandler<P>;
	onArrowPress?: ArrowPressHandler<P>;
	onFocus?: FocusHandler<P>;
	onBlur?: BlurHandler<P>;
	extraProps?: P;
}

export interface FocusableCallbackProps {
	ref: HTMLElement;
	focusSelf: (focusDetails?: FocusDetails) => void;
	focused: Accessor<boolean>;
	hasFocusedChild: Accessor<boolean>;
	focusKey: Accessor<string>;
	setFocus: (focusKey: string, focusDetails?: FocusDetails) => void;
	navigateByDirection: (direction: string, focusDetails: FocusDetails) => void;
	pause: () => void;
	resume: () => void;
	updateAllLayouts: () => void;
	getCurrentFocusKey: () => string;
}

export const useSpatialNavigation = () => {
	return {
		setFocus: SpatialNavigation.setFocus,
		navigateByDirection: SpatialNavigation.navigateByDirection,
		pause: SpatialNavigation.pause,
		resume: SpatialNavigation.resume,
		updateAllLayouts: SpatialNavigation.updateAllLayouts,
		getCurrentFocusKey: SpatialNavigation.getCurrentFocusKey,
	};
};
