<a ng-if="opt.anchor" href="{{opt.href || 'javascript:;'}}" class="btn btn-{{opt.style || 'default'}}">{{opt.text || 'Anchor'}}</a>
<button ng-if="opt.button" class="btn btn-{{opt.style || 'default'}}" type="{{opt.type}}">{{opt.text || 'Button'}}</button>
<input ng-if="opt.input" type="{{opt.type || 'button'}}" class="btn btn-{{opt.style || 'default'}}" value="{{opt.text || 'Input'}}" />
