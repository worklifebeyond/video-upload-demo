* Request with your `Bearer Token`, change this line:

```javascript
.set('Authorization', 'Bearer <your_token_here>')
```
  File:  `\src\actions\uploadActions.js`

* Video manifest

```javascript
.send({'title': 'your video title', 'description': 'your video desc', 'format': 'video MIME Type'})
```
  File:  `\src\actions\uploadActions.js`
  
* Example

![enter image description here](https://raw.githubusercontent.com/worklifebeyond/video-upload-demo/master/media_id_sample.PNG)

* W A R N I N G

  This code is legacy code, I've `npm audit fix --force` to fix everything. If you run (`npm run start`) you'll see a mess. So please fix it by yourself. If you're lazy af like me, for some good reason ofcourse, go to commit list then revert to old one (before npm audit).
