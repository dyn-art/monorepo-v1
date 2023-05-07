import React from 'react';

const PetmaPlugin: React.FC = () => {
  return (
    <div className="m-4 space-y-4">
      <h1 className="text-2xl font-bold">Petma plugin</h1>

      <div className="space-y-1">
        {/* Username Input */}
        <div>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            id="username"
            type="text"
            placeholder="Type here"
            className="input input-bordered input-sm w-full"
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Type here"
            className="input input-bordered input-sm w-full"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            id="description"
            placeholder="Type here"
            className="textarea textarea-bordered textarea-sm w-full"
            rows={2}
          />
        </div>
      </div>

      {/* Dark mode toggle */}
      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text">DarkMode</span>
          <input
            id="dark-mode-on"
            type="checkbox"
            className="toggle toggle-sm"
          />
        </label>
      </div>

      {/* Image Style Input */}
      <div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">No Image</span>
            <input
              type="radio"
              name="radio-10"
              className="radio radio-sm checked:bg-red-500"
              checked
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Single Image</span>
            <input
              type="radio"
              name="radio-10"
              className="radio radio-sm checked:bg-blue-500"
              checked
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Carousel</span>
            <input
              type="radio"
              name="radio-10"
              className="radio radio-sm checked:bg-yellow-500"
              checked
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button id="submit-post" className="btn btn-primary">
        Submit
      </button>
    </div>
  );
};

export default PetmaPlugin;
