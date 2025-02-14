const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 round-lg dark:bg-gray-700">
      <div style={{ width: `${progress}%` }} className="h-4 rounded-lg bg-green-500 transition-all duration-300">
      </div>
    </div>
  )
}

export default ProgressBar;