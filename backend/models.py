from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Date
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import create_engine
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    user_image_src = Column(String, default="/avatars/default.svg")
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=10)
    active_course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    last_active_date = Column(Date, nullable=True)   # for streak logic
    progress = relationship("UserProgress", back_populates="user")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    image_src = Column(String, default="/spain.svg")
    units = relationship("Unit", back_populates="course")

class Unit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, default="")
    order = Column(Integer)
    course_id = Column(Integer, ForeignKey("courses.id"))
    course = relationship("Course", back_populates="units")
    lessons = relationship("Lesson", back_populates="unit", order_by="Lesson.order")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    order = Column(Integer)
    unit_id = Column(Integer, ForeignKey("units.id"))
    unit = relationship("Unit", back_populates="lessons")
    challenges = relationship("Challenge", back_populates="lesson", order_by="Challenge.order")
    user_progress = relationship("UserProgress", back_populates="lesson")

class Challenge(Base):
    __tablename__ = "challenges"
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    type = Column(String)  # "SELECT", "ASSIST", "TYPE_ANSWER", "MATCH_PAIRS"
    question = Column(String)
    order = Column(Integer)
    lesson = relationship("Lesson", back_populates="challenges")
    options = relationship("ChallengeOption", back_populates="challenge")
    progress = relationship("ChallengeProgress", back_populates="challenge")

class ChallengeOption(Base):
    __tablename__ = "challenge_options"
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"))
    text = Column(String)
    correct = Column(Boolean, default=False)
    image_src = Column(String, nullable=True)
    audio_src = Column(String, nullable=True)
    challenge = relationship("Challenge", back_populates="options")

class ChallengeProgress(Base):
    __tablename__ = "challenge_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    challenge_id = Column(Integer, ForeignKey("challenges.id"))
    completed = Column(Boolean, default=False)
    challenge = relationship("Challenge", back_populates="progress")

class UserProgress(Base):
    __tablename__ = "user_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    last_attempt = Column(DateTime, default=func.now())
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="user_progress")

SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
Base.metadata.create_all(bind=engine)