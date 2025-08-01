# # import os
# # import sys
# # from datetime import datetime, timedelta
# # import subprocess
# # from pathlib import Path
# # import argparse

# # class GitCommitManager:
# #     def __init__(self, repo_path='.'):
# #         self.repo_path = Path(repo_path).resolve()
# #         self.verify_git_repo()

# #     def verify_git_repo(self):
# #         """Verify if the directory is a git repository."""
# #         if not (self.repo_path / '.git').exists():
# #             raise Exception(f"Error: {self.repo_path} is not a git repository!")

# #     def create_backdated_commit(self, date_str, message=None):
# #         """Create a backdated commit with specified date."""
# #         try:
# #             # Parse the date string to datetime
# #             try:
# #                 # Try different date formats
# #                 for date_format in ['%Y-%m-%d', '%Y/%m/%d', '%d-%m-%Y', '%d/%m/%Y']:
# #                     try:
# #                         commit_date = datetime.strptime(date_str, date_format)
# #                         break
# #                     except ValueError:
# #                         continue
# #                 else:
# #                     raise ValueError("Invalid date format. Please use YYYY-MM-DD")
# #             except ValueError as e:
# #                 print(f"Date Error: {str(e)}")
# #                 return False
            
# #             # Format the date for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE
# #             git_date_format = commit_date.strftime('%Y-%m-%d %H:%M:%S')
            
# #             # Create a temporary file if it doesn't exist
# #             temp_file = self.repo_path / '.temp_commit'
# #             temp_file.touch()

# #             # Add the file to git
# #             subprocess.run(['git', 'add', '.temp_commit'], check=True)

# #             # Set the environment variables for the commit date
# #             env = os.environ.copy()
# #             env['GIT_AUTHOR_DATE'] = git_date_format
# #             env['GIT_COMMITTER_DATE'] = git_date_format

# #             # Create the commit
# #             commit_message = message or f"Backdated commit for {date_str}"
# #             subprocess.run(
# #                 ['git', 'commit', '-m', commit_message],
# #                 env=env,
# #                 check=True
# #             )

# #             # Remove the temporary file
# #             temp_file.unlink()
            
# #             # Remove the deleted file from git
# #             subprocess.run(['git', 'add', '.temp_commit'], check=True)
# #             subprocess.run(
# #                 ['git', 'commit', '-m', f"Remove temporary file for {date_str}"],
# #                 env=env,
# #                 check=True
# #             )

# #             print(f"Successfully created backdated commit for {date_str}")
# #             return True

# #         except subprocess.CalledProcessError as e:
# #             print(f"Git Error: {str(e)}")
# #             return False
# #         except Exception as e:
# #             print(f"Error creating backdated commit: {str(e)}")
# #             return False

# # def get_input_with_default(prompt, default=None):
# #     """Get user input with a default value."""
# #     if default:
# #         result = input(f"{prompt} [{default}]: ").strip()
# #         return result if result else default
# #     return input(f"{prompt}: ").strip()

# # def interactive_mode():
# #     """Run the script in interactive mode."""
# #     print("Git Commit Backdating Tool")
# #     print("-" * 30)
    
# #     # Get date
# #     while True:
# #         date_str = get_input_with_default("Enter date (YYYY-MM-DD)", 
# #                                         datetime.now().strftime('%Y-%m-%d'))
# #         try:
# #             datetime.strptime(date_str, '%Y-%m-%d')
# #             break
# #         except ValueError:
# #             print("Invalid date format. Please use YYYY-MM-DD")
    
# #     # Get message
# #     message = get_input_with_default("Enter commit message (optional)", 
# #                                    f"Backdated commit for {date_str}")
    
# #     # Get repo path
# #     repo_path = get_input_with_default("Enter repository path (optional)", '.')
    
# #     return date_str, message, repo_path

# # def main():
# #     parser = argparse.ArgumentParser(description='Create backdated Git commits')
# #     parser.add_argument(
# #         '--date', 
# #         type=str, 
# #         help='Date for the backdated commit (YYYY-MM-DD)'
# #     )
# #     parser.add_argument(
# #         '--message', 
# #         type=str, 
# #         help='Custom commit message (optional)'
# #     )
# #     parser.add_argument(
# #         '--repo-path', 
# #         type=str, 
# #         help='Path to git repository (optional, defaults to current directory)',
# #         default='.'
# #     )
# #     parser.add_argument(
# #         '--interactive',
# #         '-i',
# #         action='store_true',
# #         help='Run in interactive mode'
# #     )

# #     args = parser.parse_args()

# #     try:
# #         # Check if we should run in interactive mode
# #         if args.interactive or not args.date:
# #             date_str, message, repo_path = interactive_mode()
# #         else:
# #             date_str = args.date
# #             message = args.message
# #             repo_path = args.repo_path

# #         # Create GitCommitManager instance
# #         commit_manager = GitCommitManager(repo_path)
        
# #         # Create the backdated commit
# #         success = commit_manager.create_backdated_commit(date_str, message)
        
# #         # Exit with appropriate status code
# #         sys.exit(0 if success else 1)

# #     except KeyboardInterrupt:
# #         print("\nOperation cancelled by user")
# #         sys.exit(1)
# #     except Exception as e:
# #         print(f"Error: {str(e)}")
# #         sys.exit(1)

# # if __name__ == "__main__":
# #     main()




# # import os
# # import sys
# # from datetime import datetime, timedelta
# # import subprocess
# # from pathlib import Path
# # import argparse

# # class GitCommitManager:
# #     def __init__(self, repo_path='.'):
# #         self.repo_path = Path(repo_path).resolve()
# #         self.verify_git_repo()

# #     def verify_git_repo(self):
# #         """Verify if the directory is a git repository."""
# #         if not (self.repo_path / '.git').exists():
# #             raise Exception(f"Error: {self.repo_path} is not a git repository!")

# #     def create_backdated_commit(self, date_str, message=None):
# #         """Create a backdated commit with specified date."""
# #         try:
# #             # Parse the date string to datetime
# #             try:
# #                 # Try different date formats
# #                 for date_format in ['%Y-%m-%d', '%Y/%m/%d', '%d-%m-%Y', '%d/%m/%Y']:
# #                     try:
# #                         commit_date = datetime.strptime(date_str, date_format)
# #                         break
# #                     except ValueError:
# #                         continue
# #                 else:
# #                     raise ValueError("Invalid date format. Please use YYYY-MM-DD")
# #             except ValueError as e:
# #                 print(f"Date Error: {str(e)}")
# #                 return False
            
# #             # Format the date for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE
# #             git_date_format = commit_date.strftime('%Y-%m-%d %H:%M:%S')
            
# #             # Create a temporary file if it doesn't exist
# #             temp_file = self.repo_path / '.temp_commit'
# #             temp_file.touch()

# #             # Add the file to git
# #             subprocess.run(['git', 'add', '.temp_commit'], check=True)

# #             # Set the environment variables for the commit date
# #             env = os.environ.copy()
# #             env['GIT_AUTHOR_DATE'] = git_date_format
# #             env['GIT_COMMITTER_DATE'] = git_date_format

# #             # Create the commit
# #             commit_message = message or f"Backdated commit for {date_str}"
# #             subprocess.run(
# #                 ['git', 'commit', '-m', commit_message],
# #                 env=env,
# #                 check=True
# #             )

# #             # Remove the temporary file
# #             temp_file.unlink()
            
# #             # Remove the deleted file from git
# #             subprocess.run(['git', 'add', '.temp_commit'], check=True)
# #             subprocess.run(
# #                 ['git', 'commit', '-m', f"Remove temporary file for {date_str}"],
# #                 env=env,
# #                 check=True
# #             )

# #             print(f"Successfully created backdated commit for {date_str}")
# #             return True

# #         except subprocess.CalledProcessError as e:
# #             print(f"Git Error: {str(e)}")
# #             return False
# #         except Exception as e:
# #             print(f"Error creating backdated commit: {str(e)}")
# #             return False

# # def get_input_with_default(prompt, default=None):
# #     """Get user input with a default value."""
# #     if default:
# #         result = input(f"{prompt} [{default}]: ").strip()
# #         return result if result else default
# #     return input(f"{prompt}: ").strip()

# # def interactive_mode():
# #     """Run the script in interactive mode."""
# #     print("Git Commit Backdating Tool")
# #     print("-" * 30)
    
# #     # Get date
# #     while True:
# #         date_str = get_input_with_default("Enter date (YYYY-MM-DD)", 
# #                                         datetime.now().strftime('%Y-%m-%d'))
# #         try:
# #             datetime.strptime(date_str, '%Y-%m-%d')
# #             break
# #         except ValueError:
# #             print("Invalid date format. Please use YYYY-MM-DD")
    
# #     # Get message
# #     message = get_input_with_default("Enter commit message (optional)", 
# #                                    f"Backdated commit for {date_str}")
    
# #     # Get repo path
# #     repo_path = get_input_with_default("Enter repository path (optional)", '.')
    
# #     return date_str, message, repo_path

# # def main():
# #     parser = argparse.ArgumentParser(description='Create backdated Git commits')
# #     parser.add_argument(
# #         '--date', 
# #         type=str, 
# #         help='Date for the backdated commit (YYYY-MM-DD)'
# #     )
# #     parser.add_argument(
# #         '--message', 
# #         type=str, 
# #         help='Custom commit message (optional)'
# #     )
# #     parser.add_argument(
# #         '--repo-path', 
# #         type=str, 
# #         help='Path to git repository (optional, defaults to current directory)',
# #         default='.'
# #     )
# #     parser.add_argument(
# #         '--interactive',
# #         '-i',
# #         action='store_true',
# #         help='Run in interactive mode'
# #     )

# #     args = parser.parse_args()

# #     try:
# #         # Check if we should run in interactive mode
# #         if args.interactive or not args.date:
# #             date_str, message, repo_path = interactive_mode()
# #         else:
# #             date_str = args.date
# #             message = args.message
# #             repo_path = args.repo_path

# #         # Create GitCommitManager instance
# #         commit_manager = GitCommitManager(repo_path)
        
# #         # Create the backdated commit
# #         success = commit_manager.create_backdated_commit(date_str, message)
        
# #         # Exit with appropriate status code
# #         sys.exit(0 if success else 1)

# #     except KeyboardInterrupt:
# #         print("\nOperation cancelled by user")
# #         sys.exit(1)
# #     except Exception as e:
# #         print(f"Error: {str(e)}")
# #         sys.exit(1)

# # if __name__ == "__main__":
# #     main()




# import os
# import sys
# from datetime import datetime
# import subprocess
# from pathlib import Path

# def backdate_changes(date="2023-10-10", message="Updated project structure and content"):
#     try:
#         # Convert date to correct format
#         commit_date = datetime.strptime(date, '%Y-%m-%d')
#         git_date_format = f"{date} 12:00:00"
        
#         # Set up git environment variables
#         env = os.environ.copy()
#         env['GIT_AUTHOR_DATE'] = git_date_format
#         env['GIT_COMMITTER_DATE'] = git_date_format

#         # Add all changes
#         subprocess.run(['git', 'add', '.'], check=True)

#         # Create the commit
#         subprocess.run(
#             ['git', 'commit', '-m', message],
#             env=env,
#             check=True
#         )

#         print(f"Successfully backdated changes to {date}")
#         return True

#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return False

# if __name__ == "__main__":
#     # Verify we're in a git repository
#     if not Path('.git').exists():
#         print("Error: Not a git repository!")
#         sys.exit(1)

#     # Get custom message if wanted
#     message = input("Enter commit message (press Enter for default): ").strip()
#     if not message:
#         message = "Updated project structure and content"

#     # Execute the backdating
#     success = backdate_changes(message=message)
    
#     if success:
#         print("\nNext steps:")
#         print("1. Verify your commit with: git log")
#         print("2. Push changes with: git push -f origin main")
#         print("\nNote: -f is required if you've previously pushed this branch")
    
#     sys.exit(0 if success else 1)




import os
import sys
from datetime import datetime
import subprocess
from pathlib import Path
import argparse
import random

class GitHistoryManager:
    def __init__(self, repo_path='.'):
        self.repo_path = Path(repo_path).resolve()
        self.verify_git_repo()

    def verify_git_repo(self):
        """Verify if the directory is a git repository."""
        if not (self.repo_path / '.git').exists():
            raise Exception(f"Error: {self.repo_path} is not a git repository!")

    def create_dated_commit(self, date_str: str, time_str: str = None, path: str = ".", message: str = None) -> bool:
        """Create a commit with specified date and time."""
        try:
            # Parse the date string to datetime
            try:
                commit_date = datetime.strptime(date_str, '%Y-%m-%d')
                
                # Handle time parameter
                if time_str:
                    try:
                        # Parse time in 24-hour format
                        time_parts = datetime.strptime(time_str, '%H:%M')
                        hour, minute = time_parts.hour, time_parts.minute
                    except ValueError:
                        print("Invalid time format. Using random business hours.")
                        hour = random.randint(9, 17)
                        minute = random.randint(0, 59)
                else:
                    # Generate random business hours if no time specified
                    hour = random.randint(9, 17)
                    minute = random.randint(0, 59)
                
            except ValueError as e:
                print(f"Date Error: {str(e)}")
                return False
            
            # Format the complete datetime
            git_date_format = f"{date_str} {hour:02d}:{minute:02d}:00"
            
            # Set the environment variables for the commit date
            env = os.environ.copy()
            env['GIT_AUTHOR_DATE'] = git_date_format
            env['GIT_COMMITTER_DATE'] = git_date_format

            # Add specified path or all changes
            if path == ".":
                subprocess.run(['git', 'add', '.'], check=True)
            else:
                subprocess.run(['git', 'add', path], check=True)

            # Create the commit
            commit_message = message or f"Update on {date_str} at {hour:02d}:{minute:02d}"
            subprocess.run(
                ['git', 'commit', '-m', commit_message],
                env=env,
                check=True
            )

            print(f"Successfully created commit for {date_str} at {hour:02d}:{minute:02d}")
            return True

        except subprocess.CalledProcessError as e:
            print(f"Git Error: {str(e)}")
            return False
        except Exception as e:
            print(f"Error creating commit: {str(e)}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Create Git commits with specific date and time')
    parser.add_argument(
        '--date',
        type=str,
        help='Date for the commit (YYYY-MM-DD)',
        required=True
    )
    parser.add_argument(
        '--time',
        type=str,
        help='Time for the commit in 24-hour format (HH:MM)',
        default=None
    )
    parser.add_argument(
        '--message',
        type=str,
        help='Commit message',
        default=None
    )
    parser.add_argument(
        '--path',
        type=str,
        help='Path to commit (defaults to entire repository)',
        default="."
    )
    parser.add_argument(
        '--push',
        action='store_true',
        help='Automatically push changes after commit'
    )

    args = parser.parse_args()

    try:
        manager = GitHistoryManager()
        success = manager.create_dated_commit(
            args.date,
            args.time,
            args.path,
            args.message
        )
        
        if success and args.push:
            # Get current branch
            current_branch = subprocess.check_output(
                ['git', 'branch', '--show-current']
            ).decode().strip()
            
            # Push changes
            subprocess.run(['git', 'push', 'origin', current_branch], check=True)
            print(f"Successfully pushed changes to {current_branch}")

        sys.exit(0 if success else 1)

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()  