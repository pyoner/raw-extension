export interface API {
  namespace: string;
  endpoint: any;
  methods: string[];
}

export type Source = any;

export interface ConnectEvent {
  type: "connect";
  from: Source;
}

export interface MessageEvent<M> {
  type: "message";
  from: Source;
  message: M;
}

export interface DisconnectEvent {
  type: "disconnect";
  from: Source;
}

export type ServerInputEvent<M> =
  | ConnectEvent
  | MessageEvent<M>
  | DisconnectEvent;

export type ServerOutputEvent<M> = {
  to: Source;
  message: M;
};

export interface ClientOutputEvent<Payload = any> {
  namespace: string;
  id: number;
  type: string;
  payload?: Payload;
}

export interface ClientInputEvent {
  id: number;
  type?: string;
  payload?: any;
}

export interface ErrorEvent extends ClientInputEvent {
  type: "error";
}

export type OverloadedFunction =
  | {
      (...args: any): any;
      (...args: any): any;
      (...args: any): any;
      (...args: any): any;
    }
  | {
      (...args: any): any;
      (...args: any): any;
      (...args: any): any;
    }
  | {
      (...args: any): any;
      (...args: any): any;
    }
  | {
      (...args: any): any;
    };

export type Overloads<T> = T extends {
  (...args: infer A1): infer R1;
  (...args: infer A2): infer R2;
  (...args: infer A3): infer R3;
  (...args: infer A4): infer R4;
}
  ? [
      (...args: A1) => R1,
      (...args: A2) => R2,
      (...args: A3) => R3,
      (...args: A4) => R4
    ]
  : T extends {
      (...args: infer A1): infer R1;
      (...args: infer A2): infer R2;
      (...args: infer A3): infer R3;
    }
  ? [(...args: A1) => R1, (...args: A2) => R2, (...args: A3) => R3]
  : T extends {
      (...args: infer A1): infer R1;
      (...args: infer A2): infer R2;
    }
  ? [(...args: A1) => R1, (...args: A2) => R2]
  : T extends {
      (...args: infer A1): infer R1;
    }
  ? [(...args: A1) => R1]
  : any;

export type OverloadedParameters<T> = Overloads<T> extends infer O
  ? {
      [K in keyof O]: Parameters<Extract<O[K], (...args: any) => any>>;
    }
  : never;

export type OverloadedReturnType<T> = Overloads<T> extends infer O
  ? {
      [K in keyof O]: ReturnType<Extract<O[K], (...args: any) => any>>;
    }
  : never;

export type UnifyOverloads<T extends (...args: any) => any> = (
  ...args: Parameters<Overloads<T>[number]>
) => ReturnType<Overloads<T>[number]>;
