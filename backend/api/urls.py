from django.urls import path
from . import views  # Import everything from views
from django.conf.urls.static import static
from django.conf import settings

class APIResolver:
    def resolve(self, path):
        if path.startswith('/media/'):
            return '/api' + path
        return path

resolver = APIResolver()

urlpatterns = [
    path("book/<pk>/", views.BookPages.as_view(), name="book-pages"),
    path("books/<pk>/delete/", views.DeleteBookView.as_view(), name='delete-book'),
    path('book/<int:book_id>/progress/', views.ReadingProgressView.as_view(), name='reading-progress'),
    path("register/", views.RegisterView.as_view(), name='register'),
    path("upload-book/", views.UploadBookView.as_view(), name="upload-book"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("user/", views.UserView.as_view(), name="user"),
    path("books/", views.BooksView.as_view(), name="books"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
