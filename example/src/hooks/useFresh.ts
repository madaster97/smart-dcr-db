import * as React from 'react'

const wrapEffect = (fn: Function) => {

}

export type State<T> =
    { status: 'complete', data: T } |
    { status: 'loading' } |
    { status: 'error', error: any };
export function useFresh<T>(promiser: () => Promise<T>): [
    state: State<T>,
    refresh: () => void
] {
    const [isFresh, setIsFresh] = React.useState<boolean>(false);
    const [data, setData] = React.useState<T | undefined>();
    const [error, setError] = React.useState<any | undefined>();

    // React.useEffect(() => {
    //     setIsFresh(false);
    // }, [promiser])

    React.useEffect(() => {
        if (!isFresh) {
            setData(undefined);
            setError(undefined);
        }
    }, [isFresh])

    React.useEffect(() => {
        let isActive = true;
        if (!isFresh) {
            promiser()
                .then(d => { if (isActive) { setData(d); setIsFresh(true); console.log('Setting data') } })
                .catch(e => { if (isActive) { setError(e); setIsFresh(true); console.log('Setting error') } })
        }
        return () => { isActive = false };
    }, [isFresh, promiser])

    const state: State<T> = !isFresh
        ? { status: 'loading' }
        : !!data
            ? { status: 'complete', data }
            : { status: 'error', error }

    return [
        state,
        () => setIsFresh(false)
    ]
}