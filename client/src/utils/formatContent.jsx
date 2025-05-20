const formatContent = (content) => {
   if (!content) return [];

   const paragraphs = content.split("\n\n");

   return paragraphs.map((paragraph, index) => {
      if (paragraph.trim().includes(":")) {
         const [title, ...details] = paragraph.split("\n");
         return (
            <div
               key={index}
               className="mb-4">
               <h4 className="font-medium text-gray-900 mb-2">
                  {title.trim()}
               </h4>
               <ul className="space-y-1 text-gray-600">
                  {details.map((detail, idx) => (
                     <li
                        key={idx}
                        className="flex">
                        <span className="mr-2">•</span>
                        <span>{detail.trim()}</span>
                     </li>
                  ))}
               </ul>
            </div>
         );
      }

      return (
         <p
            key={index}
            className="mb-4 text-gray-600">
            {paragraph.trim()}
         </p>
      );
   });
};

export default formatContent;