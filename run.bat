@echo off
setlocal enabledelayedexpansion

:: ==========================================
:: 1. VALIDATION AND SETUP
:: ==========================================

:: Check if command is provided
IF "%~1"=="" GOTO :usage

SET "COMMAND=%~1"
SET "TARGET_LIST="

:: Shift to the next argument (the project names or -all)
SHIFT

:: Check if at least one project or -all is provided
IF "%~1"=="" (
    echo Error: No project specified.
    GOTO :usage
)

:: ==========================================
:: 2. PARSE PROJECTS
:: ==========================================

:: CASE A: Run for ALL projects in apps/ folder
IF /I "%~1"=="-all" (
    echo Targeting ALL projects in 'apps\'...
    FOR /D %%D IN (apps\*) DO (
        SET "TARGET_LIST=!TARGET_LIST! %%~nxD"
    )
    GOTO :execute
)

:: CASE B: Run for specific projects passed as arguments
:arg_loop
IF "%~1"=="" GOTO :execute

:: Check if the project folder actually exists
IF NOT EXIST "apps\%~1\" (
    echo [ERROR] Project folder 'apps\%~1' does not exist.
    GOTO :invalid_project
)

SET "TARGET_LIST=!TARGET_LIST! %~1"
SHIFT
GOTO :arg_loop


:: ==========================================
:: 3. EXECUTION
:: ==========================================
:execute
IF "%TARGET_LIST%"=="" (
    echo No valid projects found to run.
    EXIT /b
)

echo.
echo ---------------------------------------------------
echo  COMMAND: %COMMAND%
echo  PROJECTS:%TARGET_LIST%
echo ---------------------------------------------------
echo.

IF /I "%COMMAND%"=="dev" GOTO :run_dev
IF /I "%COMMAND%"=="build" GOTO :run_build
IF /I "%COMMAND%"=="install" GOTO :run_install

GOTO :invalid_command


:: --- DEV HANDLER (Opens separate tabs in WT) ---
:run_dev
FOR %%P IN (%TARGET_LIST%) DO (
    echo Starting %%P in new tab...
    :: -w 0 targets the current terminal window
    wt -w 0 new-tab --title "%%P" -d ".\apps\%%P" cmd /k "npm run dev" 
)
GOTO :gitstatus


:: --- BUILD HANDLER (Sequential) ---
:run_build
FOR %%P IN (%TARGET_LIST%) DO (
    echo.
    echo [%%P] Building...
    PUSHD "apps\%%P"
    call npm run build
    POPD
)
GOTO :gitstatus


:: --- INSTALL HANDLER (Sequential) ---
:run_install
FOR %%P IN (%TARGET_LIST%) DO (
    echo.
    echo [%%P] Installing dependencies...
    PUSHD "apps\%%P"
    call npm install
    POPD
)
GOTO :gitstatus


:: ==========================================
:: 4. EXIT STATES
:: ==========================================

:usage
echo.
echo Usage: run.bat [command] [projects or -all]
echo.
echo Commands:
echo   dev      - Opens new tabs running 'npm run dev'
echo   build    - Runs 'npm run build' sequentially
echo   install  - Runs 'npm install' sequentially
echo.
echo Examples:
echo   run install -all                (Install dependencies for everything in apps/)
echo   run dev webdev-api              (Start dev server for api only)
echo   run build webdev-api webdev-web (Build specific projects)
EXIT /b

:invalid_command
echo Invalid command: %COMMAND%
EXIT /b

:invalid_project
echo Aborting operation.
EXIT /b

:gitstatus
echo.
echo ---------------------------------------------------
echo Done. Checking Git Status...
cmd /k "git status"