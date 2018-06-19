import {Component, domLoaded, request, PubSub} from '../lib/component'

const NavToggle = new Component({
	el: '#nav-toggle',
	name: 'Navigation Toggle',
  events: {
    'click .btn': 'toggleNav'
  },
  subscriptions: {},
	init() {
		this.debug('log', this.attrs)
	},

	toggleNav() {
    PubSub.publish('locationUpdate', 'hello world!')
  }
});

export default NavToggle
