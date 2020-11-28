export interface API {
  namespace: string
  endpoint: any
  methods: string[]
}

export interface BaseEvent {
  namespace: string
  type: string
  payload?: any
  id?: number
}

export interface ResponseEvent {
  id: number
  payload?: any
}

export type SendRequest = (message: BaseEvent) => void

export type OverloadedFunction =
  | {
      (...args: any): any
      (...args: any): any
      (...args: any): any
      (...args: any): any
    }
  | {
      (...args: any): any
      (...args: any): any
      (...args: any): any
    }
  | {
      (...args: any): any
      (...args: any): any
    }
  | {
      (...args: any): any
    }

export type Overloads<T> = T extends {
  (...args: infer A1): infer R1
  (...args: infer A2): infer R2
  (...args: infer A3): infer R3
  (...args: infer A4): infer R4
}
  ? [
      (...args: A1) => R1,
      (...args: A2) => R2,
      (...args: A3) => R3,
      (...args: A4) => R4,
    ]
  : T extends {
      (...args: infer A1): infer R1
      (...args: infer A2): infer R2
      (...args: infer A3): infer R3
    }
  ? [
      (...args: A1) => R1,
      (...args: A2) => R2,
      (...args: A3) => R3,
    ]
  : T extends {
      (...args: infer A1): infer R1
      (...args: infer A2): infer R2
    }
  ? [(...args: A1) => R1, (...args: A2) => R2]
  : T extends {
      (...args: infer A1): infer R1
    }
  ? [(...args: A1) => R1]
  : any

export type OverloadedParameters<
  T
> = Overloads<T> extends infer O
  ? {
      [K in keyof O]: Parameters<
        Extract<O[K], (...args: any) => any>
      >
    }
  : never

export type OverloadedReturnType<
  T
> = Overloads<T> extends infer O
  ? {
      [K in keyof O]: ReturnType<
        Extract<O[K], (...args: any) => any>
      >
    }
  : never

export type UnifyOverloads<T extends (...args: any) => any> = (
  ...args: Parameters<Overloads<T>[number]>
) => ReturnType<Overloads<T>[number]>
