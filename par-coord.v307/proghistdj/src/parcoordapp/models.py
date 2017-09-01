from django.db import models

# Create your models here.

class ParCoordUserInteractionModel(models.Model):
    userName = models.CharField(max_length = 250)
    personName = models.CharField(max_length = 500)
    data = models.TextField()
    
    def __str__(self):
        return self.userName + " - " + self.personName