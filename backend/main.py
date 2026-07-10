from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session, sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import datetime
from models import (
    engine, User, Course, Unit, Lesson,
    Challenge, ChallengeOption, ChallengeProgress, UserProgress
)

app = FastAPI(title="Duolingo Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SessionLocal = sessionmaker(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ── Mock logged-in user (assignment: no real auth) ────────────────────────────
MOCK_USER_ID = 1

# ── Achievements definitions ───────────────────────────────────────────────────
ACHIEVEMENTS = [
    {"id": 1, "title": "First Steps",     "description": "Complete your first lesson",      "xp_threshold": 10,   "icon": "🎯"},
    {"id": 2, "title": "On Fire",         "description": "Reach a 3-day streak",            "streak_threshold": 3, "icon": "🔥"},
    {"id": 3, "title": "XP Hunter",       "description": "Earn 100 XP",                     "xp_threshold": 100,  "icon": "⚡"},
    {"id": 4, "title": "Scholar",         "description": "Earn 500 XP",                     "xp_threshold": 500,  "icon": "📚"},
    {"id": 5, "title": "Week Warrior",    "description": "Reach a 7-day streak",            "streak_threshold": 7, "icon": "🏆"},
    {"id": 6, "title": "Linguist",        "description": "Earn 1000 XP",                    "xp_threshold": 1000, "icon": "🌟"},
    {"id": 7, "title": "Dedicated",       "description": "Reach a 14-day streak",           "streak_threshold": 14,"icon": "💎"},
    {"id": 8, "title": "Legend",          "description": "Earn 2000 XP",                    "xp_threshold": 2000, "icon": "👑"},
]

def get_user_achievements(user: User):
    earned = []
    for ach in ACHIEVEMENTS:
        if "xp_threshold" in ach and user.xp >= ach["xp_threshold"]:
            earned.append({**ach, "earned": True})
        elif "streak_threshold" in ach and user.streak >= ach["streak_threshold"]:
            earned.append({**ach, "earned": True})
        else:
            earned.append({**ach, "earned": False})
    return earned

def update_streak(user: User):
    """Increment or reset streak based on last_active_date."""
    today = datetime.date.today()
    if user.last_active_date is None:
        user.streak = 1
        user.last_active_date = today
    elif user.last_active_date == today:
        pass  # already active today, no change
    elif user.last_active_date == today - datetime.timedelta(days=1):
        user.streak += 1
        user.last_active_date = today
    else:
        # More than 1 day gap → reset
        user.streak = 1
        user.last_active_date = today

# ── Courses ───────────────────────────────────────────────────────────────────
@app.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return [{"id": c.id, "title": c.title, "imageSrc": c.image_src} for c in courses]

# ── Users / User Progress ─────────────────────────────────────────────────────
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "userImageSrc": u.user_image_src,
            "xp": u.xp,
            "streak": u.streak,
            "hearts": u.hearts,
            "activeCourseId": u.active_course_id,
        }
        for u in users
    ]

@app.get("/users/me")
def get_me(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    course = db.query(Course).filter(Course.id == user.active_course_id).first()
    
    # Count completed lessons
    completed_lessons = db.query(UserProgress).filter(
        UserProgress.user_id == MOCK_USER_ID,
        UserProgress.completed == True
    ).count()
    
    # Count total challenges completed
    completed_challenges = db.query(ChallengeProgress).filter(
        ChallengeProgress.user_id == MOCK_USER_ID,
        ChallengeProgress.completed == True
    ).count()
    
    achievements = get_user_achievements(user)
    earned_count = sum(1 for a in achievements if a["earned"])
    
    return {
        "id": user.id,
        "username": user.username,
        "userImageSrc": user.user_image_src,
        "xp": user.xp,
        "streak": user.streak,
        "hearts": user.hearts,
        "activeCourseId": user.active_course_id,
        "activeCourse": {"id": course.id, "title": course.title, "imageSrc": course.image_src} if course else None,
        "completedLessons": completed_lessons,
        "completedChallenges": completed_challenges,
        "achievements": achievements,
        "earnedAchievements": earned_count,
        "lastActiveDate": str(user.last_active_date) if user.last_active_date else None,
    }

@app.get("/user-progress")
def get_user_progress(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    course = db.query(Course).filter(Course.id == user.active_course_id).first()
    return {
        "userId": user.id,
        "hearts": user.hearts,
        "points": user.xp,
        "activeCourseId": user.active_course_id,
        "streak": user.streak,
        "activeCourse": {"id": course.id, "title": course.title, "imageSrc": course.image_src} if course else None,
    }

class UpsertProgressBody(BaseModel):
    courseId: int

@app.post("/user-progress")
def upsert_user_progress(body: UpsertProgressBody, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.active_course_id = body.courseId
    db.commit()
    return {"success": True}

# ── Units with lessons ────────────────────────────────────────────────────────
@app.get("/units")
def get_units(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    units = db.query(Unit).filter(Unit.course_id == user.active_course_id).order_by(Unit.order).all()
    result = []
    for unit in units:
        lessons_data = []
        for lesson in unit.lessons:
            prog = db.query(UserProgress).filter(
                UserProgress.user_id == MOCK_USER_ID,
                UserProgress.lesson_id == lesson.id,
                UserProgress.completed == True
            ).first()
            lessons_data.append({
                "id": lesson.id,
                "title": lesson.title,
                "order": lesson.order,
                "unitId": lesson.unit_id,
                "completed": prog is not None,
            })
        result.append({
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "order": unit.order,
            "courseId": unit.course_id,
            "lessons": lessons_data,
        })
    return result

# ── Lessons with challenges ───────────────────────────────────────────────────
@app.get("/lessons/{lesson_id}")
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    challenges_data = []
    for ch in lesson.challenges:
        cp = db.query(ChallengeProgress).filter(
            ChallengeProgress.user_id == MOCK_USER_ID,
            ChallengeProgress.challenge_id == ch.id,
            ChallengeProgress.completed == True,
        ).first()
        challenges_data.append({
            "id": ch.id,
            "lessonId": ch.lesson_id,
            "type": ch.type,
            "question": ch.question,
            "order": ch.order,
            "completed": cp is not None,
            "challengeOptions": [
                {
                    "id": opt.id,
                    "challengeId": opt.challenge_id,
                    "text": opt.text,
                    "correct": opt.correct,
                    "imageSrc": opt.image_src,
                    "audioSrc": opt.audio_src,
                }
                for opt in ch.options
            ],
        })
    return {
        "id": lesson.id,
        "title": lesson.title,
        "order": lesson.order,
        "unitId": lesson.unit_id,
        "challenges": challenges_data,
    }

# Get first active lesson (for /lesson page)
@app.get("/lesson/active")
def get_active_lesson(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    units = db.query(Unit).filter(Unit.course_id == user.active_course_id).order_by(Unit.order).all()
    for unit in units:
        for lesson in unit.lessons:
            prog = db.query(UserProgress).filter(
                UserProgress.user_id == MOCK_USER_ID,
                UserProgress.lesson_id == lesson.id,
                UserProgress.completed == True,
            ).first()
            if not prog:
                return get_lesson(lesson.id, db)
    # All completed – return first lesson for practice
    first_lesson = units[0].lessons[0] if units and units[0].lessons else None
    if first_lesson:
        return get_lesson(first_lesson.id, db)
    raise HTTPException(status_code=404, detail="No lessons found")

# ── Challenge Progress ────────────────────────────────────────────────────────
class ChallengeProgressBody(BaseModel):
    challengeId: int

@app.post("/challenge-progress")
def upsert_challenge_progress(body: ChallengeProgressBody, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    challenge = db.query(Challenge).filter(Challenge.id == body.challengeId).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    existing = db.query(ChallengeProgress).filter(
        ChallengeProgress.user_id == MOCK_USER_ID,
        ChallengeProgress.challenge_id == body.challengeId,
    ).first()

    is_practice = existing and existing.completed

    if existing:
        existing.completed = True
    else:
        db.add(ChallengeProgress(user_id=MOCK_USER_ID, challenge_id=body.challengeId, completed=True))

    if not is_practice:
        user.xp += 10

    # Check if all challenges in the lesson are complete → mark lesson done + update streak
    all_challenges = db.query(Challenge).filter(Challenge.lesson_id == challenge.lesson_id).all()
    all_done = all(
        db.query(ChallengeProgress).filter(
            ChallengeProgress.user_id == MOCK_USER_ID,
            ChallengeProgress.challenge_id == c.id,
            ChallengeProgress.completed == True
        ).first() is not None
        for c in all_challenges
    )
    if all_done:
        existing_prog = db.query(UserProgress).filter(
            UserProgress.user_id == MOCK_USER_ID,
            UserProgress.lesson_id == challenge.lesson_id,
        ).first()
        if existing_prog:
            existing_prog.completed = True
        else:
            db.add(UserProgress(user_id=MOCK_USER_ID, lesson_id=challenge.lesson_id, completed=True, score=80))
        
        # ── Update streak on lesson completion ──────────────────────────────
        if not is_practice:
            update_streak(user)

    db.commit()
    return {"success": True, "xp": user.xp, "streak": user.streak}

# ── Reduce Hearts ─────────────────────────────────────────────────────────────
class ReduceHeartsBody(BaseModel):
    challengeId: int

@app.post("/reduce-hearts")
def reduce_hearts(body: ReduceHeartsBody, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    if user.hearts == 0:
        return {"error": "hearts"}
    existing = db.query(ChallengeProgress).filter(
        ChallengeProgress.user_id == MOCK_USER_ID,
        ChallengeProgress.challenge_id == body.challengeId,
        ChallengeProgress.completed == True,
    ).first()
    if existing:
        return {"error": "already_completed"}
    user.hearts = max(0, user.hearts - 1)
    db.commit()
    return {"success": True}

# ── Refill Hearts ─────────────────────────────────────────────────────────────
@app.post("/refill-hearts")
def refill_hearts(db: Session = Depends(get_db)):
    from constants import POINTS_TO_REFILL
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    if user.hearts >= 5:
        return {"error": "already_full"}
    if user.xp < POINTS_TO_REFILL:
        return {"error": "not_enough_points"}
    user.hearts = 5
    user.xp -= POINTS_TO_REFILL
    db.commit()
    return {"success": True}

# ── Achievements ──────────────────────────────────────────────────────────────
@app.get("/achievements")
def get_achievements(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == MOCK_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return get_user_achievements(user)

# ── Leaderboard ───────────────────────────────────────────────────────────────
@app.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.xp.desc()).limit(10).all()
    return [
        {
            "userId": u.id,
            "userName": u.username,
            "userImageSrc": u.user_image_src,
            "points": u.xp,
            "streak": u.streak,
        }
        for u in users
    ]