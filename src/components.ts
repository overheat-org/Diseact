interface NewLifecycle<P, S, SS> {
	getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null;
	componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
}
interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS> {
	componentDidMount?(): void;
	shouldComponentUpdate?(nextProps, nextState, nextContext): boolean;
	componentWillUnmount?(): void;
	componentDidCatch?(error: Error, errorInfo: { componentStack?: string | null, digest?: string | null })
}
interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}
declare class Component<P, S> {
	constructor(props: P);
	setState<K extends keyof S>(
		state: ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null) | (Pick<S, K> | S | null),
		callback?: () => void,
	): void;

	forceUpdate(callback?: () => void): void;
	render(): ReactNode;

	readonly props: Readonly<P>;
	state: Readonly<S>;
}