# FlowReader
#### Video Demo: < https://youtu.be/PSks1SQWFGM >
## An interactive word-by-word reader that lets you upload books and read faster, keeping you engaged and reducing distractions.

## Distinctiveness and Complexity:
FlowReader is an interactive word-by-word PDF reader designed to help users read faster and stay focused. By displaying one word at a time, the app creates an immersive reading experience that keeps users engaged and minimizes distractions. This approach helps you maintain focus without the need to constantly search for the next line. Users can upload their own books and adjust the reading pace to suit their preferences, while the ability to navigate anywhere on the page with a single click or slide ensures a smooth and personalized experience. This unique method not only promotes faster reading but also forces a better concentration, making it ideal for those looking to read more effectively and with fewer interruptions.

This project addresses a common challenge faced by readers of all ages: maintaining focus and consistency while reading. By displaying only one word at a time, it encourages active reading, preventing distractions that often occur when the reader looks away and loses context. Unlike traditional books, there's no need to search for the next line or word. How many times have you started reading the wrong line after losing track? In this app, you always have a fixed point of focus, with each word presented in sequence, allowing for a seamless and distraction-free reading experience.

This website is designed for individuals looking to enhance their reading speed. The interactive UI offers a seamless user experience, keeping users engaged while navigating the site.

For creating this website I mainly used two frameworks django and react, of the two, the most important was react I cant see how I could build the word-by-word component without the getters, setters, useEffect hook and lots of prebuilt react components like the sliders. For the react dependencies I used:
    @emotion/react
    @emotion/styled
    @mui/material
    @react-pdf-viewer/core
    @react-pdf-viewer/default-layout
    axios
    bootstrap-icons
    bootstrap
    js-cookie
    pdfjs-dist
    react-bootstrap
    react-icons
    react-router-dom
    react-transition-group

For the django depencies:
    django-cors-headers
    pdfplumber

The best features of this website include: A smooth login and registration system that switches seamlessly between the two without page reloads, thanks to React. Users can upload PDFs either by selecting a file or dragging and dropping it. The site includes a book library that shows all uploaded books, with the option to delete any of them. Once a book is selected, users can navigate between pages, and there's a switch to enable or disable the automatic page turn. A slider at the top lets users adjust the reading speed from 100 to 500 words per minute. The left panel displays the original PDF page, allowing users to check images that can't be shown in the word-by-word mode, the bottom left shows the percentage of the book read, while the right panel focuses on the dynamic word-by-word display. This display calculates time intervals for each word based on punctuation, ensuring a more natural reading pace. Controls at the bottom include a large play/pause button, which can also be triggered by the spacebar, and a slider for quick navigation, with dynamic markers placed at punctuation to help users return to key points in a page. Lastly, the app always remembers the last page read, allowing users to pick up right where they left off.

### here are some key parts of the of my code:

#### This is how the word-by-word display works

```javascript
  const words = currentText.split(" ");
  // Word-By-Word Display
  useEffect(() => {
    if (isPaused || currentWordIndex >= words.length) return;

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev + 1 >= words.length) {
          clearInterval(interval);
          return words.length - 1;
        }
        return prev + 1;
      });
    }, calculateInterval(WordsPerMinute, words[currentWordIndex] || ""));
    return () => clearInterval(interval);
  }, [WordsPerMinute, currentWordIndex, isPaused, words]);
```

As you can see, it's actually quite simple. The first condition checks if it’s the last word of the array or if isPaused is set to true. If either of these is true, nothing changes in the display. After that, I use split to turn the text into an array of words. With the array in hand, I set an interval that calls the calculateInterval function. This function looks at the current word and checks if any characters need a longer interval (for example, punctuation). If the next word goes past the end of the array, it stops at the last word. If it’s not the last word, it just adds 1 to prev and shows the next word.


#### This is how the word-by-word display works

```python
class BookPages(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request, pk):
        book = Book.objects.get(id=pk)
        pages = book.get_text_and_pages()
        title = book.title

        progress = LectureProgress.objects.filter(reader=request.user, book=book).first()
        last_page_read = progress.last_page_read if progress else 1

        pdf = request.build_absolute_uri('/api' + book.pdf.url)
        data = {"title": title, "pdf":pdf, "pages": pages, "last_page_read": last_page_read}
        return Response(data ,status=status.HTTP_200_OK)
```

In this Django view, I return data about the current book (title, PDF, pages, and the last page read). To do this, I use the built-in permission classes to ensure the user is authenticated. I then get the book object by its ID from the request. Using the book's methods, I retrieve the pages and the title. I also check if there’s a record of the last page read by the user. If there is, I use it; if not, I default to page 1 to load the first page of the book. Lastly, I build the URL for the PDF so it can be used on the React frontend.

### The process of building - And the design choices!

#### To talk about the challenges I faced and my design choices, I have to take a step-by-step approach to the things I did in order to complete this site.

The first thing I implemented was a login screen designed to toggle seamlessly between login and registration without reloading the page. While this may seem like a simple feature, it took me about two days to implement. The process taught me a lot about React, especially state management within the framework.
The final result is smooth, and I believe the goal was successfully achieved. Additionally, I added a circular loading indicator to every waiting state in the app using the useState hook, enhancing the user experience by providing clear feedback during loading times.
The next step was clear: I needed a drag-and-drop interface. Since this is a common feature on the web, it was easy to find inspiration. Using React's state management, I implemented a dynamic interface. For example, when a user hovers a file over the drop area, the background changes to orange, and the dashed border becomes solid. This provides immediate visual feedback, letting the user know the site recognizes their action.
Once a user drops or selects a PDF, the app uses psfjs library to extract the first page and convert it into an image, which serves as the book's thumbnail. The upload container displays this thumbnail along with a text input for the user to enter the book's title. Initially, I considered adding an automatic chapter detection feature. However, due to the wide variety of book formatting, this idea remained in the planning phase.
After the user submits a book, they are redirected to the "My Books" page, where they can view all uploaded books. Each book has a trash can icon in the top-right corner for deletion. Clicking it triggers a smooth animation that reduces the book’s opacity and horizontal size before it’s removed from the library. Implementing this subtle animation took hours of fine-tuning, but the end result was worth the effort.
As for the word-by-word reader, I had no clear inspiration since similar tools are rare on the web. This pushed me to develop unique solutions. One major issue with word-by-word readers is the lack of visual context, as many books include images that are crucial for storytelling or education. To address this, I designed the reader to display the PDF on the left and word-by-word reader on the right.
The reader's core functionality revolves around a main component, Reader, which manages data fetching and page transitions. It sends the current page data and page management functions to both the PDF viewer and word-by-word component. This ensures synchronization: when the user clicks "Next" or "Previous," both the PDF and word-by-word views update simultaneously. Likewise, when the word-by-word reader auto-advances, the PDF on the left also updates. This cohesive design greatly enhances usability and ensures a seamless reading experience.
One feature I initially wanted to implement was the ability to return to the beginning of a sentence by pressing the punctuation button. However, this turned out to be quite complex, especially in cases where the last punctuation mark was on the previous page. Handling page transitions within this functionality would have required significant effort and introduced additional complexity.
Instead, I took my brother's suggestion to implement a solution similar to YouTube’s progress bar, allowing users to navigate anywhere on the page with a simple click. I decided to use the MUI Slider component for this functionality. By setting the current value of the slider to the current word index, I created a navigation bar that lets users jump to any word on the page instantly.
To make the slider even more user-friendly, I added markers at key punctuation points, such as dots and commas. This visual clue helps users quickly locate and return to the beginning of a sentence, making the reading experience easier and more intuitive.
One of the most detailed and thoughtful features of this website is the dynamic interval adjustment based on punctuation. Initially, every word was displayed with the same interval, regardless of whether it followed a period or comma. This felt unnatural and disrupted the reading flow, as it didn’t allow for the natural pauses readers need to process sentences and paragraphs. These pauses are crucial for comprehension and reflection, and without them, the reading experience became mechanical and less engaging.
To address this, I created a js object of timing multipliers. Since the interval is dynamically calculated based on each user's reading speed, applying standard reading pause rules wouldn’t make sense. Instead, the multipliers adjust the interval proportionally. For instance, after a comma, the interval increases by 50%, applying a multiplier of 1.5. After a period, the interval doubles, using a multiplier of 2.0. This adjustment made the reading flow more natural and significantly improved the user experience.
The final feature I implemented was the ability for users to resume reading from the last page they viewed. This was a crucial addition because it solves the common problem of forgetting where you left off. Not only is this feature highly user-centric, but it was also straightforward to implement. It simply involves sending a PUT request to the server to update the user's last-read page.By enabling users to pick up right where they left off, the reading experience becomes seamless and more convenient, enhancing the overall usability of the app.

### Conclusion

Building this site was a rewarding experience. I learned a lot about React and state management, and it significantly clarified my understanding of what makes a good API, including the importance of consistent response status patterns. Although this was a relatively simple project designed to speed up reading and minimize distractions, the development process taught me a great lesson about general programming and frameworks.
This project opened my eyes to the power of React and reinforced the importance of having a diverse toolkit to select the best tools for each job. While the site performs well, there’s always room for improvement. For instance, handling PDF parsing could be significantly faster if implemented in a lower-level language like C.
In conclusion, I’m really proud of the final result, particularly the user interface. It’s visually appealing and highly interactive, with thoughtful design choices that make the user experience enjoyable and intuitive. Thank you for taking the time to check out what I’ve built—I hope you enjoy it as much as I enjoyed creating it!


# How to run the aplication

The first thing is to run the django aplication inside the root of the backend runing "python manage.py runserver"

I couldn't manage to sent the aplication with the node_mode because I kept geting this error:

  flowReader/ $ submit50 web50/projects/2020/x/capstone
  Connecting.....
  Looks like you are in a directory with too many (> 10000) files.
  You are currently in: /workspaces/159014349/flowReader, did you perhaps intend another directory?
  Submission cancelled.

So I deleted the node_modules directory, so it is necessary to run "npm install --production" before running "npm start"on the frontend to install the necessary modules to run the React server.
