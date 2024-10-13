import { useState, useRef, useEffect } from "react";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import "../App.css";

const Result = () => {
  const [inputText, setInputText] = useState(""); // 入力されたテキストを保持
  const [image, setImage] = useState(null); // 選択された画像
  const [data, setData] = useState([]); // バブルチャート用のデータ
  const svgRef = useRef();

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 画像データを保存
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBubble = () => {
    // 入力されたテキストと画像をバブルのデータとして追加
    if (inputText || image) {
      setData((prevData) => [
        ...prevData,
        {
          text: inputText,
          image: image,
          radius: 30, // ランダムな半径
          x: Math.random() * (800 - 60) + 30, // ランダムなX座標
          y: Math.random() * (400 - 60) + 30, // ランダムなY座標
        },
      ]);
      setInputText(""); // 入力フィールドをクリア
      setImage(null); // 画像をクリア
    }
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 以前の描画をクリア

    // バブルチャートの描画
    data.forEach((d) => {
      svg
        .append("circle")
        .attr("cx", d.x) // ランダムなX座標
        .attr("cy", d.y) // ランダムなY座標
        .attr("r", d.radius) // 半径
        .style("fill", "blue")
        .style("opacity", 0.5); // 半透明に設定

      svg
        .append("image")
        .attr("xlink:href", d.image) // 画像データを設定
        .attr("x", d.x - d.radius) // バブルの中心に画像を表示
        .attr("y", d.y - d.radius)
        .attr("width", d.radius * 2) // 画像の幅
        .attr("height", d.radius * 2) // 画像の高さ
        .style("clip-path", "circle(50%)"); // 画像を円形にクリップ

      svg
        .append("text")
        .attr("x", d.x)
        .attr("y", d.y)
        .attr("dy", ".35em") // テキストのY位置調整
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text(d.text);
    });
  }, [data]);
  return (
    <div>
      <h2>Bubble Chart with Input</h2>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text"
      />
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={handleAddBubble}>Add Bubble</button>
      <svg ref={svgRef} width={800} height={400} />
    </div>
  );
};

export default Result;
