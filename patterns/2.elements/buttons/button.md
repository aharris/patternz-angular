---
Name:
Buttons

Options:
anchor: boolean,
button: boolean,
input: boolean,
type: string, // Values: button, submit | Default: button | Should only be used if input is true
href: string,
text: string,
style: string // Values: default, primary, success, info, warning, danger, link | default: default

Description:
We are buttons

Example:
anchor: true,
text: 'primary button',
style: 'primary'
---
<a ng-if="opt.anchor" href="{{opt.href || 'javascript:;'}}" class="btn btn-{{opt.style || 'default'}}">{{opt.text || 'Anchor'}}</a>
<button ng-if="opt.button" class="btn btn-{{opt.style || 'default'}}" type="{{opt.type}}">{{opt.text || 'Button'}}</button>
<input ng-if="opt.input" type="{{opt.type || 'button'}}" class="btn btn-{{opt.style || 'default'}}" value="{{opt.text || 'Input'}}" />
