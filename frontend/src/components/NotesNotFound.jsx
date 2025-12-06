import { StickyNote } from "lucide-react";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 transition-colors">
        <StickyNote className="size-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-2xl font-hand font-bold text-gray-700 dark:text-gray-200 transition-colors">
        The wall is empty
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-sans transition-colors">
        Be the first to stick a thought on the wall! Click the + button below.
      </p>
    </div>
  );
};
export default NotesNotFound;
