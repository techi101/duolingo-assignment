type Props = {
  children: React.ReactNode;
};

const LessonLayout = ({ children }: Props) => {
  return ( 
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="flex flex-col h-full w-full">
        {children}
      </div>
    </div>
  );
};
 
export default LessonLayout;
