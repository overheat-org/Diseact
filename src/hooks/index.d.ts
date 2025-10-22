export type Dispatch<A> = (value: A) => void;
export type StateUpdater<S> = S | ((prevState: S) => S);

export function useState<S>(
	initialState: S | (() => S)
): [S, Dispatch<StateUpdater<S>>];

export function useState<S = undefined>(): [
	S | undefined,
	Dispatch<StateUpdater<S | undefined>>
];

export function useEffect(effect: () => void | (() => void), inputs?: ReadonlyArray<unknown>): void;
