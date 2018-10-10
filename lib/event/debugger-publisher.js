'use strict'

const CaseIgnoredStore = require('../store/case-ignored-store')

const subscribers = new CaseIgnoredStore()
class DebuggerPublisher {
  static publish (event) {
    if (!subscribers.includes(event.name)) return

    return subscribers.get(event.name).forEach((subscribe) => {
      subscribe.call(null, event)
    })
  }

  static addSubscriber (event, subscriber) {
    if (!subscribers.includes(event)) {
      subscribers.set(event, [])
    }
    subscribers.get(event).push(subscriber)
    return subscribers.get(event).length - 1
  }

  static unsubscribe (event, subscriberId) {
    subscribers.get(event).splice(subscriberId, 1)
  }

  static clearSubscriber (event) {
    subscribers.set(event, [])
  }
}

module.exports = DebuggerPublisher
