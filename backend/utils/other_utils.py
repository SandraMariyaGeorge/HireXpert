def snake_case(string):
    """
    Converts a given camelCase or PascalCase string to snake_case.

    Args:
        string (str): The input string in camelCase or PascalCase format.

    Returns:
        str: The converted string in snake_case format.
    """
    return ''.join(['_'+i.lower() if i.isupper() else i for i in string]).lstrip('_')

def words_to_snake_case(string):
    """
    Converts a given string with words separated by spaces into snake_case format.

    Args:
        string (str): The input string with words separated by spaces.

    Returns:
        str: The converted string in snake_case format.
    """
    return '_'.join(string.split()).lower()