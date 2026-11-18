# تقدّم تعريب T3 Code

آخر تحديث: 2026-11-18

## الحالة

| #   | المهمة                           | الحالة                              |
| --- | -------------------------------- | ----------------------------------- |
| 1   | تجهيز مكان العمل وتشغيل البرنامج | منجزة                               |
| 2   | النسخة العلنية على GitHub        | منجزة: `3ssiri/t3code` فرع `arabic` |
| 3   | الجرد                            | منجزة                               |
| 4   | قاموس المصطلحات ودليل الأسلوب     | معتمدة                              |
| 5   | أدوات الترجمة                    | منجزة                               |
| 6   | تسجيل العربية واتجاه الصفحة      | منجزة                               |
| 7   | ترجمة تجريبية                    | منجزة                               |
| 8   | الترجمة الكاملة                  | منجزة ومراجعة                       |
| 9   | أساس الاتجاه                      | منجزة                               |
| 10  | إصلاحات التنسيق                   | لم تبدأ                             |
| 11  | التحقق الشامل                    | لم تبدأ                             |
| 12  | دليل التشغيل                     | منجزة: `docs/arabic/README.md`      |
| 13  | المزامنة الأسبوعية                | السكربت منجز، الجدولة تنتظر المالك  |
| 14  | الجاهزية للتقديم                 | لم تبدأ                             |

## الأساس

| البند    | القيمة                                                                                 |
| -------- | -------------------------------------------------------------------------------------- |
| الفرع    | `arabic`                                                                               |
| مبني على | `upstream/main` عند `b8b5affac42a8fd55d89214996c28afdb3c54ab1`                         |
| ملاحظة    | الطلب `#37893` دُمج في الأصل يوم 2026-11-18 (`055b44919`)، فلم نعد نحتاج البناء على فرعه |

## التغطية

| التطبيق    | المترجم     |
| ---------- | ----------- |
| الويب      | `9641/9641` |
| سطح المكتب | `101/101`   |

## الدفعات للأصل

| الدفعة                        | الحالة                     |
| ----------------------------- | -------------------------- |
| 0 — تعليق على النقاش `#37962` | لم تبدأ                    |
| 1 — العربية للويب وسطح المكتب | تنتظر طلبًا صريحًا من الفريق |
| 2 — إصلاحات الاتجاه             | تنتظر طلبًا صريحًا من الفريق |
| 3 — الجوال                    | خارج المرحلة الأولى         |
| 4 — الموقع التسويقي           | خارج المرحلة الأولى         |

### إصلاحات خلل مرشّحة للتقديم (لا تحتاج موافقة مسبقة)

| الالتزام      | الخلل                                                                          |
| ------------ | ------------------------------------------------------------------------------ |
| `812ff97055` | `vp run i18n:check` يفشل دائمًا على ويندوز لأنه يشغّل ملف `gt` دون وسيط `cmd.exe` |

## مهلة الرد

لم تبدأ. تبدأ من تاريخ نشر تعليقنا على `#37962`، ومدتها أسبوعان.

## آخر مزامنة

- التاريخ: 2026-11-18
- الهدف: `upstream/main` عند `f5f8c8d18baf6a194fea9c7a3734158c2b7ea57b`
- عدد المفاتيح الجديدة بلا ترجمة: 9742
- مهلة الرد: لم تبدأ (لم يُنشر التعليق بعد).
- ملاحظات الفاحص: 11594

أول 20 ملاحظة (التطبيق والمفتاح والقاعدة):

- `web:23be753133ae6950` — untranslated
- `web:0001ae5846061bb6` — bidi-isolate
- `web:0001ae5846061bb6` — untranslated
- `web:eef7f4dacbc3c3f2` — untranslated
- `web:422ced5cda40580e` — untranslated
- `web:47e6147265a28164` — untranslated
- `web:4735345a111c1581` — untranslated
- `web:fd07736396b009c5` — untranslated
- `web:cbbdd0430fbe5fea` — untranslated
- `web:2a918ed2e51ab64a` — untranslated
- `web:ed0fecca26116eda` — untranslated
- `web:521b55ffc0a546df` — untranslated
- `web:7953122755efa56e` — untranslated
- `web:d9a8c7734f54ea3f` — untranslated
- `web:215fbed6f97db37d` — untranslated
- `web:b5899546709c27ef` — bidi-isolate
- `web:b5899546709c27ef` — untranslated
- `web:4160b5f3b4d6ccb0` — bidi-isolate
- `web:4160b5f3b4d6ccb0` — untranslated
- `web:6365146db77a8dac` — bidi-isolate

أول 200 مفتاح (المفتاح والنص الإنجليزي):

- `web:23be753133ae6950` — "Thread"
- `web:0001ae5846061bb6` — "Thread on {machine}"
- `web:eef7f4dacbc3c3f2` — "Machine"
- `web:422ced5cda40580e` — "Fetch base branch"
- `web:47e6147265a28164` — "Check out files"
- `web:4735345a111c1581` — "Init submodules"
- `web:fd07736396b009c5` — "Run setup script"
- `web:cbbdd0430fbe5fea` — "Start agent"
- `web:2a918ed2e51ab64a` — "Connecting"
- `web:ed0fecca26116eda` — "Counting objects"
- `web:521b55ffc0a546df` — "Receiving objects"
- `web:7953122755efa56e` — "Resolving deltas"
- `web:d9a8c7734f54ea3f` — "Checking out files"
- `web:215fbed6f97db37d` — "Stalled"
- `web:b5899546709c27ef` — "{organization} manages T3 Code updates."
- `web:4160b5f3b4d6ccb0` — "{organization} manages T3 Code updates. Only stable releases can be installed."
- `web:6365146db77a8dac` — "{organization} limits threads to Supervised."
- `web:2aa1c01bf8014725` — "{organization} limits threads to Auto-accept edits."
- `web:89563a8fff8bb751` — "{organization} limits threads to Auto."
- `web:5b7ff1208620c2c2` — "{organization} limits threads to Full access."
- `web:9bf017edd3847eb1` — "{organization}'s policy does not allow connecting from other devices."
- `web:ef9533bcc048f17b` — "{organization}'s policy does not allow T3 Connect."
- `web:986b0873f913a840` — "{organization}'s policy does not allow webhook tasks."
- `web:eebc538e25b09fe2` — "{organization}'s policy does not allow importing browser cookies."
- `web:39f6771b49f9b3b6` — "Use default"
- `web:45bb0e90e1c42046` — "When you return"
- `web:d8fa0a55446bbb0d` — "Before the cache expires (beta)"
- `web:1574d19b613d3274` — "Never"
- `web:a78eb961f5618e7f` — "Not installed on this machine."
- `web:4c34e647dc74b279` — "Needs Keychain access to read its cookies."
- `web:a613ba1b6f32fc2c` — "No encryption key in your Keychain. Sign in to that browser once, then retry."
- `web:322d9662c37ead48` — "Give T3 Code Full Disk Access in System Settings → Privacy & Security, then retry."
- `web:24fdd54c2321912a` — "Quit the browser first so its cookie database can be read."
- `web:1e3857bfd41528f6` — "Importing from this browser isn't possible on this platform."
- `web:2bfa3f72b8bb8657` — "The system keyring could not be accessed. Make sure your desktop keyring is running and unlocked, then retry."
- `web:57ffe3c729859a5c` — "That browser is no longer available to import from."
- `web:901aacb02a7beae4` — "That browser profile no longer exists."
- `web:c4eab322aec9a04f` — "The target profile could not be opened."
- `web:2f05086ff12267da` — "The cookies were imported, but the new profile couldn't be saved. Try again."
- `web:117699038dd92eca` — "You've reached the profile limit. Delete a profile or import into an existing one."
- `web:7a92629ebbd4373b` — "The browser's cookie database could not be read."
- `web:868f7db396cd02e1` — "Install Git from {url} or with your package manager."
- `web:1fcffc9b1a7d921c` — "Install Jujutsu with {command} or from {url}."
- `web:94168222df47e6a3` — "Install the GitHub command-line tool ({cli}) via {url} or your package manager (for example {command})."
- `web:6ff697b80a1714c7` — "Install the GitLab command-line tool ({cli}) from {url} or your package manager (for example {command})."
- `web:929a11e234f6e5d9` — "Install the Azure command-line tools ({cli}), then enable Azure DevOps support with {command}."
- `web:ad599e9de33538dd` — "Add a Bitbucket token in Settings → Source control & issues."
- `web:d810ecd91e8cf9d0` — "Install the Origin CLI with {install}, then run {login}."
- `web:eb0f60ef4f92ab7d` — "Install {fj} 0.6 or later from {fjUrl} and run {fjLogin}, or install {tea} 0.16 or later from {teaUrl} and run {teaLogin} for each Forgejo or Gitea server."
- `web:d026a85e2e50e675` — "Install the GitCafe CLI with {install}, then run {login}, save a token in Settings, or set {variable} on the server."
- `web:79d776428f4d0650` — "The file could not be loaded. Reconnect and try again."
- `web:3ea34cbb1ca5ba9b` — "Preview cancelled."
- `web:7c0af279ecb3da3a` — "Streaming file previews are unavailable in this runtime."
- `web:b9b44ab15899825c` — "closed this as {reason}"
- `web:f108e643221e7d74` — "closed this"
- `web:5d54f319cedcf527` — "reopened this"
- `web:d97c57d0c9027ac3` — "added the {label} label"
- `web:e239c162e83830cc` — "added a label"
- `web:bd48b7647505baf0` — "removed the {label} label"
- `web:0f5cc9a80b2ff27c` — "removed a label"
- `web:ec67c06b05b64e55` — "assigned {person}"
- `web:310c69411e81254a` — "assigned someone"
- `web:3d5e4378da957f99` — "unassigned {person}"
- `web:70bf19d6d8c7ee87` — "unassigned someone"
- `web:7038da871014d3dc` — "renamed this to “{title}”"
- `web:15d8439ffefcfbf7` — "renamed this"
- `web:19073c3f6d6de736` — "referenced this from {source}"
- `web:31f3a74cc3fe5109` — "referenced this"
- `web:bab01672497c144c` — "moved this to {state}"
- `web:1861f909464425a6` — "changed the state"
- `web:bd672d0adf5e6d9a` — "Writing to this tracker needs the source-control write scope."
- `web:bfe81d615f5f8f75` — "This issue is outside every project's own scope, so it is read-only here."
- `web:b455e8f32a9d4c40` — "a machine"
- `web:4cded869dea19ab2` — "Waiting for an answer in the original thread"
- `web:2b94dca2d528688f` — "Linked a machine"
- `web:929e93b30d895f49` — "Linked {target}"
- `web:5ac4edf5195056fb` — "Linked a machine · {access}"
- `web:36db2352fc10a1f3` — "Linked {target} · {access}"
- `web:8cc00444f7443feb` — "Declined"
- `web:289ec1df10840137` — "Could not link: the other environment refused"
- `web:21be308917bd450e` — "Could not link: {failure}"
- `web:acd01e781e2355cc` — "Request ended"
- `web:97e4c50a99272f63` — "Could not answer the request. Try again."
- `web:f71597ae3afaef44` — "{first} and {second}"
- `web:4047174839a16714` — "{first}, and {last}"
- `web:65ca7867c176afbf` — "{first}, {rest}"
- `web:c4eb2b21c8c58a54` — "Normal"
- `web:f42c2a36b3507308` — "{label} On"
- `web:77cc5f738cb7d459` — "{label} Off"
- `web:2159a4897d4a4d73` — "{runtime, select, codex {Update the Codex CLI to {version} or newer to use {names}.} other {Update {providerName} to {version} or newer to use {names}.}}"
- `web:d887bea446534de5` — "No project in this environment can read {host}/{repository}."
- `web:4e466d60e2f7736b` — "Paste the full pull request URL; this thread has no repository to resolve the number against."
- `web:302625058bacbe38` — "Paste a full URL; this project's host has no known {changeRequest} URL."
- `web:3b69223ffe164a8b` — "thumbs up"
- `web:2da037a654c9a831` — "thumbs down"
- `web:3e9ce8c394906785` — "laugh"
- `web:9f76009d2c20bad9` — "hooray"
- `web:c09113673509ef58` — "confused"
- `web:6f4296feb3bd16dc` — "heart"
- `web:ab713f11723496be` — "rocket"
- `web:e81fa5bcc610f0ce` — "eyes"
- `web:8149ea600ec59e44` — "{count, plural, one {{count} other} other {{count} others}}"
- `web:992a924827dcc3cf` — "{count, plural, one {{count} person} other {{count} people}}"
- `web:1de2e78c92a8f600` — "{names} reacted with thumbs up emoji"
- `web:2dbf5720a46cb44e` — "{names} reacted with thumbs down emoji"
- `web:c215a389d0c2dc5b` — "{names} reacted with laugh emoji"
- `web:27b889ce571d2043` — "{names} reacted with hooray emoji"
- `web:86c904191672c2cc` — "{names} reacted with confused emoji"
- `web:81229eb9f6b94347` — "{names} reacted with heart emoji"
- `web:ba3ba00d620e455d` — "{names} reacted with rocket emoji"
- `web:fc34e41fa0315912` — "{names} reacted with eyes emoji"
- `web:0c982111ac348e9f` — "You"
- `web:766ea446df1695f7` — "Answer the question to edit queued messages"
- `web:257dc29de5b1f1f7` — "Context, no code"
- `web:edb97296086ba31e` — "{count, plural, one {{count} file} other {{count} files}}"
- `web:556df31b330166ff` — "Enter a name for this view."
- `web:262cd2c6c05667db` — "Use {max} characters or fewer."
- `web:3a85d6e4f8a78c72` — "A view with this name already exists."
- `web:d3f84105b0d04d6a` — "equals"
- `web:7c67f23eece49873` — "does not equal"
- `web:cc74241937cc5ae7` — "is one of"
- `web:05ca8007a6b0c810` — "starts with"
- `web:bb4fc62e86e58898` — "exists"
- `web:d2d9554583bf2e13` — "Use at most {max} filters."
- `web:0cb7a36802fe8089` — "Filter {number} needs a path under body, headers or query."
- `web:1fa38fb049c6b56e` — "Filter {number} needs a path under body, headers or query, and at least one value."
- `web:31ec02bdcb3920d1` — "Filter {number} needs a path under body, headers or query, and a value."
- `web:81f613bb68d85bb7` — "Kept out of chat, in a private file this agent's commands can read for 24 hours"
- `web:62ae4688ece05590` — "Stored securely, never shown to the agent"
- `web:8c2d901183b4e219` — "Paste the secret"
- `web:610aea624f895a78` — "Saved securely and kept private"
- `web:329b7854b7e0546e` — "Use a 1Password reference like {example}."
- `web:d68b539295c009d3` — "{count, plural, one {Delegated {count} task} other {Delegated {count} tasks}}"
- `web:0ccb2e7aa712bec4` — "{count, plural, one {Tried to delegate {count} task} other {Tried to delegate {count} tasks}}"
- `web:73208f89396763ce` — "{count, plural, one {Requested interrupts for {count} thread} other {Requested interrupts for {count} threads}}"
- `web:fbcb5ee41b6af029` — "{count, plural, one {Tried to interrupt {count} thread} other {Tried to interrupt {count} threads}}"
- `web:4bb589f533d7104e` — "{count, plural, one {Requested stops for {count} workflow} other {Requested stops for {count} workflows}}"
- `web:5a376cdf302a0c06` — "{count, plural, one {Tried to stop {count} workflow} other {Tried to stop {count} workflows}}"
- `web:a1919d11faf439f0` — "{count, plural, one {Requested cancellation of {count} task} other {Requested cancellation of {count} tasks}}"
- `web:873844fac08f4af2` — "{count, plural, one {Tried to cancel {count} task} other {Tried to cancel {count} tasks}}"
- `web:ed5dfaaa143abfe9` — "{count, plural, one {Scheduled {count} task} other {Scheduled {count} tasks}}"
- `web:60a98d3dd26fd076` — "{count, plural, one {Tried to schedule {count} task} other {Tried to schedule {count} tasks}}"
- `web:7b84dcb47332374f` — "{count, plural, one {Updated {count} scheduled task} other {Updated {count} scheduled tasks}}"
- `web:c493fa485c69d685` — "{count, plural, one {Tried to update {count} scheduled task} other {Tried to update {count} scheduled tasks}}"
- `web:060b3cb5eb21c525` — "{count, plural, one {Requested deletion of {count} scheduled task} other {Requested deletion of {count} scheduled tasks}}"
- `web:b407587073dcf004` — "{count, plural, one {Tried to delete {count} scheduled task} other {Tried to delete {count} scheduled tasks}}"
- `web:51faae5b2aa811a9` — "{count, plural, one {Requested {count} scheduled task run} other {Requested {count} scheduled task runs}}"
- `web:cf8be1e9feadc483` — "{count, plural, one {Tried to request {count} scheduled task run} other {Tried to request {count} scheduled task runs}}"
- `web:7bfec6ae54efaf52` — "{count, plural, one {Requested {count} thread fork} other {Requested {count} thread forks}}"
- `web:ec261d201aef2cac` — "{count, plural, one {Tried to request {count} thread fork} other {Tried to request {count} thread forks}}"
- `web:a7531c82d7e278e3` — "{count, plural, one {Requested {count} context merge} other {Requested {count} context merges}}"
- `web:2a3d2dc0ad92f7ce` — "{count, plural, one {Tried to request {count} context merge} other {Tried to request {count} context merges}}"
- `web:8d22859454becdde` — "{count, plural, one {Updated {count} thread} other {Updated {count} threads}}"
- `web:820100f4094d2a34` — "{count, plural, one {Tried to update {count} thread} other {Tried to update {count} threads}}"
- `web:4e787fc8a1cf1cef` — "{count, plural, one {Read {count} queued message} other {Read {count} queued messages}}"
- `web:2e0ea993bfa4dc98` — "{count, plural, one {Tried to read {count} queued message} other {Tried to read {count} queued messages}}"
- `web:a835543fc6e8ec2a` — "{count, plural, one {Edited {count} queued message} other {Edited {count} queued messages}}"
- `web:e8d87d8714b84042` — "{count, plural, one {Tried to edit {count} queued message} other {Tried to edit {count} queued messages}}"
- `web:0f5216ab78499863` — "{count, plural, one {Requested cancellation of {count} queued run} other {Requested cancellation of {count} queued runs}}"
- `web:09944176ef419109` — "{count, plural, one {Tried to cancel {count} queued run} other {Tried to cancel {count} queued runs}}"
- `web:65775afbed8d69e2` — "{count, plural, one {Reordered {count} queued run} other {Reordered {count} queued runs}}"
- `web:a07cd10f895b6d3d` — "{count, plural, one {Tried to reorder {count} queued run} other {Tried to reorder {count} queued runs}}"
- `web:22930c6336026d54` — "{count, plural, one {Requested steering with {count} queued message} other {Requested steering with {count} queued messages}}"
- `web:7bb49cd86025a9b1` — "{count, plural, one {Tried to steer with {count} queued message} other {Tried to steer with {count} queued messages}}"
- `web:e0eb9789ef67caca` — "{count, plural, one {Read {count} pending question request} other {Read {count} pending question requests}}"
- `web:160e547dde9acd47` — "{count, plural, one {Tried to read {count} pending question request} other {Tried to read {count} pending question requests}}"
- `web:e3d1cdf864354683` — "{count, plural, one {Answered {count} pending question request} other {Answered {count} pending question requests}}"
- `web:17f78424a768a8d5` — "{count, plural, one {Tried to answer {count} pending question request} other {Tried to answer {count} pending question requests}}"
- `web:7265a10d823ae08f` — "{count, plural, one {Asked for {count} secret} other {Asked for {count} secrets}}"
- `web:bd4141e4464734ae` — "{count, plural, one {Tried to ask for {count} secret} other {Tried to ask for {count} secrets}}"
- `web:3685ecb8634fe00c` — "{count, plural, one {Handed off to {count} worktree} other {Handed off to {count} worktrees}}"
- `web:186bc3ed600d2102` — "{count, plural, one {Tried to hand off to {count} worktree} other {Tried to hand off to {count} worktrees}}"
- `web:ea38f91437c9fd84` — "{count, plural, one {Read {count} project} other {Read {count} projects}}"
- `web:962b5c9a64a23fda` — "{count, plural, one {Tried to read {count} project} other {Tried to read {count} projects}}"
- `web:5f6309ffbb9206e5` — "{count, plural, one {Registered {count} project} other {Registered {count} projects}}"
- `web:d78907ab6058a093` — "{count, plural, one {Tried to register {count} project} other {Tried to register {count} projects}}"
- `web:073ea3efd51dfe64` — "{count, plural, one {Updated {count} project} other {Updated {count} projects}}"
- `web:88904d03737a4ce2` — "{count, plural, one {Tried to update {count} project} other {Tried to update {count} projects}}"
- `web:c70885e9576133d4` — "{count, plural, one {Deleted {count} project} other {Deleted {count} projects}}"
- `web:5ce63b5e8f11d92a` — "{count, plural, one {Tried to delete {count} project} other {Tried to delete {count} projects}}"
- `web:1f6229d05665d1aa` — "{count, plural, one {Cloned {count} repository} other {Cloned {count} repositories}}"
- `web:4969464f492cf38b` — "{count, plural, one {Tried to clone {count} repository} other {Tried to clone {count} repositories}}"
- `web:4bbd9889e5db5595` — "{count, plural, one {Asked to link {count} environment} other {Asked to link {count} environments}}"
- `web:ee03b15162b1a3b6` — "{count, plural, one {Tried to ask to link {count} environment} other {Tried to ask to link {count} environments}}"
- `web:d00581102becbcb5` — "{count, plural, one {Forgot {count} linked environment} other {Forgot {count} linked environments}}"
- `web:ef72ee358987af11` — "{count, plural, one {Tried to forget {count} linked environment} other {Tried to forget {count} linked environments}}"
- `web:c1ea7882fa0a2342` — "{count, plural, one {Prepared {count} attachment upload} other {Prepared {count} attachment uploads}}"
- `web:b1b53f8de7d04e89` — "{count, plural, one {Tried to prepare {count} attachment upload} other {Tried to prepare {count} attachment uploads}}"
- `web:f73f9ed65bc2a7fd` — "{count, plural, one {Discarded {count} pending attachment} other {Discarded {count} pending attachments}}"
- `web:1a95887865d12a29` — "{count, plural, one {Tried to discard {count} pending attachment} other {Tried to discard {count} pending attachments}}"
- `web:a558c604de74d0f0` — "{count, plural, one {Watching {count} pull request} other {Watching {count} pull requests}}"
- `web:c46ce0608869d876` — "{count, plural, one {Tried to watch {count} pull request} other {Tried to watch {count} pull requests}}"
- `web:0c95997b46696e93` — "{count, plural, one {Stopped watching {count} pull request} other {Stopped watching {count} pull requests}}"
- `web:291cc15cb0e4d326` — "{count, plural, one {Tried to stop watching {count} pull request} other {Tried to stop watching {count} pull requests}}"
- `web:7cadfa909b5f748c` — "{count, plural, one {Read {count} review guide} other {Read {count} review guides}}"
- `web:25c3110254123c9c` — "{count, plural, one {Tried to read {count} review guide} other {Tried to read {count} review guides}}"
- `web:753d66d408b70482` — "{count, plural, one {Listed issues {count} time} other {Listed issues {count} times}}"
- `web:dee679e40e5c63ca` — "{count, plural, one {Tried to list issues {count} time} other {Tried to list issues {count} times}}"
- `web:0b8be109ff37b16e` — "{count, plural, one {Read {count} issue} other {Read {count} issues}}"
- `web:9e6e630b3fd95d3b` — "{count, plural, one {Tried to read {count} issue} other {Tried to read {count} issues}}"

## طريقة التشغيل والفحص على هذا الجهاز

```bash
# vp from https://vite.plus
vp run dev --home-dir "$PWD/.t3" --no-seed
```

رابط الدخول لا يُطبع في المخرجات. يُستخرج بأمر منفصل والخادم يعمل:

```bash
node apps/server/src/bin.ts pair --base-dir "$PWD/.t3" --ttl 30m
```

فحص الترجمة: `vp run i18n:check` يعمل على ويندوز بعد الالتزام `812ff97055`.

فحص النوع الموجّه: `vp run --filter @t3tools/client-runtime typecheck` ينتهي بلا أخطاء (اقتراحات فقط).

## ما لم يُتحقق منه

- اختبارات المتصفح لمفاتيح الأسهم في قائمة مستوى التفكير ومسار الملفات لم تُشغَّل بعد.
- لوحة شجرة الملفات بجانب الفروق تُسحب بالعكس في العربية؛ مؤجلة للمهمة 10.
- اختباران يفشلان على هذا الجهاز قبل الترجمة وبعدها: `ResourceTelemetryDiagnostics.logic.test.ts` (الكود يستعمل `toLocaleString(undefined)` فتظهر أرقام هندية حين تكون لغة الجهاز عربية) و`AttachmentFilePreview.browser.test.tsx` (قياس ارتفاع). الأول خلل حقيقي للمهمة 10.
