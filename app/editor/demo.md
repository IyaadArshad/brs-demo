# Example document
Lorem ipsum
<!-- 
brs-document 

data = { "backgroundedText": {}, "coloredText": {}}
-->

```js
console.log("Markdown document:", `
// Example document
Lorem ipsum
<!-- 
brs-document 

data = { "backgroundedText": {}, "coloredText": {}}
-->
`);
console.log("Document extras:", {
  backgroundedText: {},
  coloredText: {}
});
console.log("Document extras raw:", `data = { "backgroundedText": {}, "coloredText": {} }`);
```
