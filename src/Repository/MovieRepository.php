<?php
namespace App\Repository;

use App\Entity\Movie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class MovieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Movie::class);
    }

    /**
     * @return array|Array
     */
    public function findAllOnlyTitle(): array
    {
        $entityManager = $this->getEntityManager();

        $result = $entityManager->createQuery(
            'SELECT M
            FROM App\Entity\Movie M'
        )->getResult();

        return $this->getOnlyTitle($result);
    }

    /**
     * @param array $array
     * @return Array
     */
    private function getOnlyTitle(Array $array): Array
    {
        $result = [];

        foreach($array as $movie) {
            $name = $movie->getTitle();
            if ($name) {
                $result[$movie->getId()] = $name;
            }
        }

        return $result;
    }
}