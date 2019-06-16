# v1.0
## Removed features/radically changed behavior
### minimalScopesMode
As of !633, `scopeOptions` is no longer available and instead is changed for `minimalScopesMode` (default: `false`)

Reasoning is that scopeOptions option originally existed mostly as a backwards-compatibility with GNU Social which only had `public` scope available and using scope selector would''t work. Since at some point we dropped GNU Social support, this option was mostly a nuisance (being default `false`'), however some people think scopes are an annoyance to a certain degree and want as less of that feature as possible.

Solution - to only show minimal set among: *Direct*, *User default* and *Scope of post replying to*. This also makes it impossible to reply to a DM with a non-DM post from UI.

*This setting is admin-default, user-configurable. Admin can choose different default for their instance but user can override it.*
