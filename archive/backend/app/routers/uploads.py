from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.config import get_settings
from app.deps import require_admin
from app.models import User
from app.schemas import UploadSignRequest, UploadSignResponse
from app.services.storage import make_upload_token, resolve_upload_path, validate_upload_token

router = APIRouter(prefix="/api/uploads", tags=["uploads"])
settings = get_settings()


@router.post("/sign", response_model=UploadSignResponse)
def sign_upload(payload: UploadSignRequest, _: User = Depends(require_admin)):
    path = resolve_upload_path(payload.filename)
    token = make_upload_token(path)
    return UploadSignResponse(upload_url="/api/uploads/put", token=token, path=path)


@router.post("/put")
async def upload_file(
    token: str = Form(...),
    path: str = Form(...),
    file: UploadFile = File(...),
    _: User = Depends(require_admin),
):
    if not validate_upload_token(token, path):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid upload token")
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    content = await file.read()
    target.write_bytes(content)
    return {"ok": True, "path": path}
