import domready from 'domready'
import domLoaded from './dom-loaded'
import attributes from 'data-attributes'
import request from 'superagent'
import PubSub from 'pubsub-js'
import utility from './utility'
import 'nodelist-foreach-polyfill'

const eventSplitter = str => {
  const delegateEventSplitter = /^(\S+)\s*(.*)$/
  const match = str.match(delegateEventSplitter)
  return {
    name: match[1],
    selector: match[2]
  }
}

class awesomeComponent {
    constructor(node, ...options ) {
      Object.assign( this, ...options )
        this.element = node
        this.ready.call( this )
    }
    ready() {
      if (!this.element) { this.mount(); return }
      domLoaded.then(() => {
        this.beforeMount()
        this.mount()
        this.afterMount()
       })
    }
    debug( logtype, log ) {
      console[logtype]( `Debug: ${this.name}\n`, log )
    }
    getAttributes() {
      this.attrs = !this.el ? false : attributes(this.element)
    }
    getAnalyticsConfiguration() {
      if(this.attrs.analyticsConfiguration) {
        this.analytics = JSON.parse(this.attrs.analyticsConfiguration)
      }
    }
    measure (data = this.analytics) {
      if (window.GlobalMessage) {
        GlobalMessage('measure.component', data);
      }
    }
    bindSubscriptions() {
      if ( this.subscriptions && typeof this.subscriptions == 'object' ) {
        for ( let [sub, cb] of Object.entries( this.subscriptions ) ) {
          let _self = this
          let componentCallback = typeof cb === 'function' ? cb : this[cb]
          PubSub.subscribe( sub, componentCallback.bind(_self) )
        }
      }
    }
    beforeInit() {}
    init() {
      console.warn(`${this.name} did not provide an init function`)
    }
    afterInit() {}
    bindEvents() {
      if ( !this.element && this.events ) {
        console.warn(`${this.name} requires an element to bind events to`)
        return
      }
      if ( this.events && typeof this.events == 'object' ){
        for ( let [ev, cb] of Object.entries( this.events ) ){
          let componentEvent = eventSplitter(ev)
          let componentCallback = typeof cb === 'function' ? cb : this[cb]
          let _self = this
					const elementTarget = this.element.querySelectorAll(`${componentEvent.selector}`)
					this.element.addEventListener( componentEvent.name, function(e){
            if ( e.target.matches(componentEvent.selector) ) {
              componentCallback.bind( _self, e ).call()
            }
          })
        }
      }
    }
    beforeMount(){}
    mount() {
      this.getAttributes()
      this.getAnalyticsConfiguration();
      this.bindEvents()
      this.bindSubscriptions()
      if (!this.defer) {
        this.beforeInit()
        this.init()
        this.afterInit()
      }
    }
    afterMount(){}
}

const Component = function(...props) {
  const options = props[0]
  domLoaded.then(() => {
    const nodes = document.querySelectorAll( options.el )
    nodes.forEach(node => {
      new awesomeComponent(node, options)
    })
  })
}

export { Component, domready, domLoaded, request, PubSub, utility }
