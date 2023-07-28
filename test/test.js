// 初始化
StyleViewer.init(document.body);

// 開始選擇元素
StyleViewer.enterSelectingMode();

// 結束選擇元素
StyleViewer.exitSelectingMode();

// 取得所有樣式
StyleViewer.getAllStyle(document.body);

// 取得陣列中的樣式
StyleViewer.getStylesByArray(document.body, ["width", "height", "display", "margin"]);

// 取得字串中的樣式 ( 以空格分開 )
StyleViewer.getStylesByString(document.body, "width height display margin");