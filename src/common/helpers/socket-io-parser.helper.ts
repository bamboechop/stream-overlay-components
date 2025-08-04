/**
 * Parses Socket.IO messages received via native WebSocket connection
 * Socket.IO messages have the format: ENGINE_IO_PACKET_TYPE + SOCKET_IO_PACKET_TYPE + JSON_PAYLOAD
 * Example: "42['API:Playback', {'data': {...}, 'type': '...'}]"
 * Where:
 * - 4 = Engine.IO MESSAGE packet type
 * - 2 = Socket.IO EVENT packet type
 */

export interface SocketIOMessage {
  eventName: string;
  eventData: any;
}

export interface SocketIOParseResult {
  success: boolean;
  message?: SocketIOMessage;
  error?: string;
  rawData?: string;
}

/**
 * Parses a raw Socket.IO message string into event name and data
 */
export function parseSocketIOMessage(rawMessage: string): SocketIOParseResult {
  try {
    // Handle different Engine.IO and Socket.IO packet types
    if (rawMessage.startsWith('0')) {
      // Engine.IO handshake - contains connection parameters
      const handshakeData = JSON.parse(rawMessage.substring(1));
      return { success: true, message: { eventName: 'handshake', eventData: handshakeData } };
    }

    if (rawMessage.startsWith('40')) {
      // Socket.IO CONNECT packet - could be plain "40" or "40[...]"
      if (rawMessage === '40') {
        return { success: true, message: { eventName: 'connect', eventData: null } };
      }
      // Parse potential JSON data after "40"
      try {
        const connectData = JSON.parse(rawMessage.substring(2));
        return { success: true, message: { eventName: 'connect', eventData: connectData } };
      } catch {
        return { success: true, message: { eventName: 'connect', eventData: rawMessage } };
      }
    }

    if (rawMessage.startsWith('42')) {
      // Socket.IO EVENT packet - this is what we want for API messages
      // Continue with normal parsing below
    } else if (rawMessage.startsWith('2')) {
      // Engine.IO ping from server - we need to respond with pong (3)
      return { success: true, message: { eventName: 'ping', eventData: rawMessage } };
    } else if (rawMessage.startsWith('3')) {
      // Engine.IO pong - response from client (shouldn't receive this)
      return { success: true, message: { eventName: 'pong', eventData: rawMessage } };
    } else {
      // Other packet types we don't handle yet
      return {
        success: false,
        error: `Unsupported packet type: ${rawMessage.substring(0, 2)}`,
        rawData: rawMessage,
      };
    }

    // Remove the "42" prefix to get the JSON payload
    const jsonPayload = rawMessage.substring(2);

    // Parse the JSON array [eventName, eventData]
    const parsed = JSON.parse(jsonPayload);

    if (!Array.isArray(parsed) || parsed.length < 2) {
      return {
        success: false,
        error: 'Invalid Socket.IO message format: expected array with at least 2 elements',
        rawData: rawMessage,
      };
    }

    const [eventName, eventData] = parsed;

    if (typeof eventName !== 'string') {
      return {
        success: false,
        error: 'Invalid Socket.IO message format: event name must be a string',
        rawData: rawMessage,
      };
    }

    return {
      success: true,
      message: {
        eventName,
        eventData,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      rawData: rawMessage,
    };
  }
}

/**
 * Type guard to check if a Socket.IO message is a Cider API:Playback event
 */
export function isCiderPlaybackEvent(message: SocketIOMessage): boolean {
  return message.eventName === 'API:Playback'
    && message.eventData
    && typeof message.eventData === 'object'
    && 'data' in message.eventData
    && 'type' in message.eventData;
}
