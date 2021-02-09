const $$events = Symbol('events')

export class EventEmitter {
    private [$$events]?: { [key: string]: ((...args: any[]) => void)[] }

    on(ev: string, fn: (...args: any) => void) {
        if (!this[$$events]) {
            this[$$events] = {}
        }
        const events = this[$$events]!
        if (!events[ev]) {
            events[ev] = []
        }

        events[ev].push(fn)

        return () => {
            events[ev] = events[ev].filter(eventFn => fn !== eventFn)
            if (events[ev].length === 0) {
                delete events[ev]
            }
            if (Object.keys(events).length === 0) {
                delete this[$$events]
            }
        }
    }

    emit(ev: string, ...args: any[]) {
        const events = this[$$events] && this[$$events]![ev]
        if (events) {
            events.forEach(fn => {
                fn.call(null, ...args)
            })
        }
    }
}

export function FunctionEventEmitter<T extends any[], R>(fn: (...args: T) => R) {
    Object.setPrototypeOf(fn, EventEmitter.prototype)
    return fn as ((...args: T) => R) & EventEmitter
}
