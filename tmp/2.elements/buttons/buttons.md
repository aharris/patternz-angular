
<a ng-if="opt.anchor" href="{{opt.href || 'javascript:;'}}" class="btn btn-default">{{opt.text || 'Anchor'}}</a>
<button ng-if="opt.button" class="btn btn-default" type="{{opt.type}}">{{opt.text || 'Button'}}</button>
<input ng-if="opt.input" type="{{opt.type || 'button'}}" class="btn btn-default" value="{{opt.text || 'Input'}}" />
