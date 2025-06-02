import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * What: Emits the specified event synchronously with the provided payload.
   * Why: Allows immediate broadcasting of events to subscribers.
   * @param event - The name of the event to emit.
   * @param payload - The data to be sent along with the event.
   */
  emit(event: string, payload: any) {
    return this.eventEmitter.emit(event, payload);
  }

  /**
   * What: Emits the specified event asynchronously with the provided payload.
   * Why: Supports broadcasting of events to subscribers without blocking the calling code.
   * @param event - The name of the event to emit asynchronously.
   * @param payload - The data to be sent along with the event.
   * @returns A Promise that resolves once all listeners have processed the event.
   */

  emitAsync(event: string, payload: any) {
    return this.eventEmitter.emitAsync(event, payload);
  }
}
