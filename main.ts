import { Plugin } from "obsidian";
export default class ExamplePlugin extends Plugin {
	// 当加载该插件时会发生什么
	statusBarTextElement: HTMLSpanElement;

	//需要了解
	//1. 各种事件 例如active-leaf-change
	//2. 编写callback函数 对事件做出反应



	onload() {
		// 在下方加入状态栏 显示hello
		this.statusBarTextElement = this.addStatusBarItem().createEl("span");
		this.statusBarTextElement.textContent = "Hello";

		// 注册一个监听 每当发生对应事件就调用回调函数（这里是匿名无参数函数）
		// 由于read方法返回Promise 因此是异步的 要加上async和await
		this.app.workspace.on("active-leaf-change", async () => {
			// 返回一个现在阅读的file(可能没有)
			const file = this.app.workspace.getActiveFile();
			if (file) {
				// 读取file的内容
				const content = await this.app.vault.read(file);
				// 如果file存在并且检测到活动页面切换就更新行数
				// 但还有一个问题 如果加了几行 只能切页或者重载才能更新 没法动态重载
				// 要解决这个问题 我们必须监听更改这个动作
				this.updateLineCount(content);
			}
			else{
				this.updateLineCount(undefined)
			}
		});
		// ctrl+p重载页面,ctrl+shift+i打开控制台看效果

		this.app.workspace.on("editor-change", (editor) => {
			// getValue 获取内容文本 editor 为该编辑器
			const content = editor.getDoc().getValue();
			this.updateLineCount(content);
		});
	}

	private updateLineCount(fileContent?: string) {
		// 三目运算符，如果内容存在（有打开文件）计算行数，没有则返回0
		// /\r\n|\r|\n/是正则表达式 用/括起来
		const count: number = fileContent
			? fileContent.split(/\r\n|\r|\n/).length
			: 0;
		const linesWord: string = count === 1 ? "line" : "lines";
		this.statusBarTextElement.textContent = `${count} ${linesWord}`;
	}
}
