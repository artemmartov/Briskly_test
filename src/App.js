import React, { Component } from "react";
import "./App.scss";

export default class App extends Component {
  state = {
    drag: false,
    file: "",
    imagePreviewUrl: "",
    dragCounter: 0,
    files: "",
    error: false
  };

  dropRef = React.createRef();

  // Движение картинки по области
  handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Картинка попадает в область Drag and Drop
  handleDragIn = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      drag: true
    });
  };

  // Картинка покинула область Drag and Drop
  handleDragOut = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      drag: false
    });
  };

  // Дроп картинки
  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      let reader = new FileReader();
      let file = e.dataTransfer.files[0];
      if (file.type !== "image/jpeg") {
        this.setState({
          error: true,
          drag: false
        });
      } else {
        reader.onloadend = () => {
          if (this.state.imagePreviewUrl !== reader.result) {
            this.setState({
              drag: !this.state.drag,
              file: file,
              imagePreviewUrl: reader.result,
              error: false,
              drag: false
            });
          } else {
            alert("Данное изображение уже загружено!");
          }
        };
      }
      reader.readAsDataURL(file);
      e.dataTransfer.clearData();
    }
  };

  componentDidMount() {
    let div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }

  // Вывод в консоль картинки в base64
  _handleSubmit(e) {
    e.preventDefault();
    console.log(
      this.state.imagePreviewUrl.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ""
      )
    );
  }

  // Загрузка картинки
  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        error: false
      });
    };
    reader.readAsDataURL(file);
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          className="main__image-user"
          src={imagePreviewUrl}
          alt="urlimage"
        />
      );
    } else {
      $imagePreview = (
        <label htmlFor ="file">
          Перетащите нужную картинку, или <span>нажмите</span> чтобы выбрать
        </label>
      );
    }

    return (
      <div className="main">
        {this.state.error ? (
          <div className="main__title-error">
            ОШИБКА! Выбран неверный формат!
          </div>
        ) : null}
        <div className={this.state.drag ? "main__block-two" : "main__block"}>
          <div ref={this.dropRef} className="main__image-wrapper">
            <div className="main__image">{$imagePreview}</div>
            <form onSubmit={e => this._handleSubmit(e)}>
              <input
                className="main__input-hidden"
                type="file"
                name="file"
                id="file"
                onChange={e => this._handleImageChange(e)}
              />
            </form>
          </div>
        </div>
        {imagePreviewUrl ? (
          <button
            className="main__base-btn"
            type="submit"
            onClick={e => this._handleSubmit(e)}
          >
            Вывести в base64
          </button>
        ) : null}
      </div>
    );
  }
}
