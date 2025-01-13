from django.db import models
from django.contrib.auth.models import AbstractUser
import pdfplumber
import json
from django.db.models.signals import post_save
from django.dispatch import receiver

class Reader(AbstractUser):
    pass

class Book(models.Model):
    uploaded_by = models.ForeignKey(Reader, on_delete=models.CASCADE)
    pdf = models.FileField(upload_to='pdfs/')
    title = models.CharField(max_length=128)
    thumbnail = models.ImageField(upload_to='thumbnails/')
    text_data = models.TextField(blank=True, null=True)
    is_ready = models.BooleanField(default=False)

    def process_and_save_text(self):
        """Extracts text and pages from the PDF, cleans it, and saves it to the `text_data` field."""
        result = {'pages': []}

        try:
            with pdfplumber.open(self.pdf.path) as pdf:
                for i, page in enumerate(pdf.pages):
                    raw_text = page.extract_text()
                    cleaned_text = ' '.join(raw_text.splitlines()).strip() if raw_text else ""
                    result['pages'].append({
                        'text': cleaned_text,
                        'page_number': i + 1,
                    })

            # Save the processed result as JSON
            self.text_data = json.dumps(result)
            self.is_ready = True
            self.save()
        except Exception as e:
            self.is_ready = False
            self.save()
            raise RuntimeError(f"Failed to process {self.pdf.path}: {e}")

    def get_text_and_pages(self):
        if not self.text_data:
            self.process_and_save_text()
        return json.loads(self.text_data)

    def get_number_of_pages(self):
        text_data = self.get_text_and_pages()
        return len(text_data['pages'])

# Signal to automatically process the book after upload
@receiver(post_save, sender=Book)
def process_book_text_on_upload(sender, instance, created, **kwargs):
    if created and not instance.text_data:
        instance.process_and_save_text()



class LectureProgress(models.Model):
    reader = models.ForeignKey(Reader, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    last_page_read = models.IntegerField(default=1)
