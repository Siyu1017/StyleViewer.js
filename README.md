# StyleViewer.js
用於查看網頁中元素樣式的 JavaScript 庫

## 使用方式
```html
<!-- 在網頁中加入以下代碼 -->
<script src="https://siyu1017.github.io/StyleViewer.js/dist/StyleViewer.min.js"></script>
```

詳情 : https://siyu1017.github.io/StyleViewer.js/

💡按下 Alt 即可阻止 Popup 移動

## 更新內容
- 色碼判別
- 元素 Box Model

## 修復內容
- 按下 Alt 並讓網頁失焦後 Popup 沒有反應
- *`element.style`* 在正常情況下格式為 `attribute: value;` ，但當 *`element.style`* 為 `attribute` 時，會發生錯誤，例如 : `<div style="example"></div>`，會出現 
    
    ```
    StyleViewer.min.js:1 Uncaught TypeError: Cannot read properties of undefined (reading 'trim')
        at u (StyleViewer.min.js:1:19969)
        at c (StyleViewer.min.js:1:17670)
        at HTMLBodyElement.<anonymous> (StyleViewer.min.js:1:21957)
    ```
    的錯誤
