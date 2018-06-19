import { Component, domLoaded, request, PubSub, utility } from '../lib/component'

const Example = new Component( {
    el: '.example',
    name: 'Example Component',
    events: {
      'click .btn': 'somefunk',
      'click .btntwo': 'morefunk'
    },
    subscriptions: {
      'locationUpdate': 'subhandler'
    },

    init() {
      console.log('Example Init')
    },

    keyHandler(e) {
      console.log(e);
    },

    somefunk(e){
			console.log(e);
      this.debug('warn', this.attrs)
    },
    morefunk(event){
			console.log(e);
      this.debug('info', this.attrs)
    },
    subhandler(data, msg){
			console.log(e);
      this.debug('info', {data, msg})
    }
} )

export default Example
